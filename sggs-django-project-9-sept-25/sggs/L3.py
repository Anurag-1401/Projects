#!/usr/bin/env python
# coding: utf-8

# # Processing Invoices Using Box MCP Server

# In this lesson, you'll process the same invoices using Box MCP Server. A Box account was created for this course. It has one folder that includes the same invoices you processed in the first lesson. You are provided with the required credentials to enable the Box MCP server to use Box API to check the content of the Box account.

# <div style="background-color:#fff6ff; padding:13px; border-width:3px; border-color:#efe6ef; border-style:solid; border-radius:6px">
# <p>💻 &nbsp; <b>To access the <code>requirements.txt</code>, <code>env.example</code> and the MCP server files:</b> 1) click the <em>"File"</em> option in the top menu of the notebook 2) click <em>"Open"</em>.
# 
# <p>⬇ &nbsp; <b>Download Notebooks:</b> 1) click the <em>"File"</em> option in the top menu of the notebook and then 2) click <em>"Download as"</em> and select <em>"Notebook (.ipynb)"</em>.</p>
# </div>

# In[ ]:


import warnings
warnings.filterwarnings('ignore')


# In[ ]:


import os
import json
import sqlite3
from dotenv import load_dotenv
from google import genai
from google.genai import types
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

_ = load_dotenv(override=True)


# **Note:** You can check the `env.example` in the lesson's folder to check the environment variables that represent the credentials needed to connect to the provided Box account.

# Let's now configure a few settings that you'll use throughout the notebook.
# 
# Just like before, you'll use Gemini 2.5 Flash. Since you're going to run the MCP server locally, the files of the MCP server are provided to you in this lesson's folder (cloned from this [repo](https://github.com/box-community/mcp-server-box)). You will use two tools from the MCP server:
# - One to list the contents of a folder
# - And one to extract data from files using AI
#   
# You can find [here](https://github.com/box-community/mcp-server-box) the complete list of the server's tools.

# In[ ]:


MODEL_NAME = "gemini-2.5-flash"
BOX_MCP_SERVER_PATH = "./mcp-server-box"
BOX_MCP_TOOLS = [
    "box_list_folder_content_by_folder_id",
    "box_ai_extract_freeform_tool",
]

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
BOX_FOLDER_ID = os.getenv("BOX_FOLDER_ID")


# ## Configuring Box MCP Server

# First, let's configure Gemini and prepare the connection to Box's MCP Server.

# In[ ]:


llm_client = genai.Client(api_key=GEMINI_API_KEY)

server_params = StdioServerParameters(
    command="uv",
    args=[
        "--directory",
        BOX_MCP_SERVER_PATH,
        "run",
        "src/mcp_server_box.py",
    ],
)


# Now, let's create a function to set up the list of MCP tools that will be used to interact with Box.
# 
# <img src="images/tools.png" width=450>

# In[ ]:


async def get_mcp_tools(session: ClientSession):
    """
    Set up the list of MCP tools that will be used to interact with Box.
    """
    mcp_tools = await session.list_tools()

    return [
        types.Tool(
            function_declarations=[
                {
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": {p: v for p, v in tool.inputSchema.items()},
                }
            ]
        )
        for tool in mcp_tools.tools
        if tool.name in BOX_MCP_TOOLS
    ]


# ## Processing invoices

# Let's start by defining the same helper function that will help process JSON results from Gemini.

# In[ ]:


def parse_json(content):
    # Try parsing as pure JSON first
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass

    # If that fails, try to extract JSON from the text
    # Look for JSON-like content between curly braces
    import re

    json_match = re.search(r"\{.*\}", content, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass

    # If all else fails, return the original text
    return content


# Since you are going to be using Box's MCP Server, let's create a function that generates a response to a user's query or prompt. This function takes care of passing the prompt (user's query) and tool definitions to Gemini, and handling any tool invocation using the MCP server.
# 
# <img src="images/tool_invocation.png" width=450>

# In[ ]:


async def generate(
    prompt: str, llm_client: genai.Client, session: ClientSession = None, tools: list = None
):
    """
    Generate content using the Gemini model using MCP tools if provided.
    """

    def parse_content(content):
        try:
            return parse_json(content.text)
        except json.JSONDecodeError:
            return content.text

    config = (
        types.GenerateContentConfig(temperature=0, tools=tools)
        if session is not None and tools is not None
        else None
    )

    response = llm_client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=config,
    )

    if response.candidates[0].content.parts[0].function_call:
        print(
            f'[Calling MCP Tool: "{response.candidates[0].content.parts[0].function_call.name}"]'
        )
        function_call = response.candidates[0].content.parts[0].function_call
        response = await session.call_tool(
            function_call.name, arguments=dict(function_call.args)
        )

        return [parse_content(content) for content in response.content]

    return response.candidates[0].content.parts[0].text


# Let's define a function that extracts the data from a given invoice. This function uses Box's MCP Server to do that.

# In[ ]:


async def extract_invoice_fields(
    invoice: dict, llm_client: genai.Client, session: ClientSession, tools: list
):
    """
    Extract data from the given invoice.
    """
    print(f'Extracting data from invoice "{invoice["name"]}"...')
    prompt = (
        "Extract the following fields from the invoice "
        f"with file_id {invoice['id']}: "
        "client_name, invoice_amount, product_name. "
        "Return the invoice_amount as a float. "
    )
    response = await generate(prompt, llm_client, session, tools)
    result = json.loads(response[0]["answer"])
    result["file"] = invoice["name"]
    return result


# Let's set up the database where you'll store the information of every invoice.

# In[ ]:


connection = sqlite3.connect("invoices.db")
cursor = connection.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS invoices (
        file TEXT PRIMARY KEY UNIQUE,
        client TEXT,
        amount REAL,
        product TEXT
    )
""")
connection.commit()


# Let's create a Gemini session with access to Box's MCP Server, list the invoices stored in Box and extract the data from each of them:
# 
# - In the first line, the MCP client is created and passed to it the standard Input/Output configuration of the Box MCP server. This will spawn the MCP server in the background. 
# - In the second line, the MCP client session is created with the read and write streams of the MCP server
# - In the third line, the MCP client is initialized. This will establish the connection between the MCP client and the MCP server.
# - Next to discover the tools available through the MCP server, the `get_mcp_tools` function is called.
# - Using the `generate` function, Gemini is asked to list the contents of the folder specified by the Box folder ID variable. Gemini will process the prompt and realize there's a tool that can handle it. The MCP client will then ask the MCP server to invoke it, which will return the response.
# - Then, for each invoice, the `extract_invoice_fields` function is called; Gemini will decide to use the extract tool to pull out the data.

# **Note:** The following cell might take a few minutes to process each of the 5 invoices.

# In[ ]:


async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
        tools = await get_mcp_tools(session)

        # Get the list of invoices from the Box folder.
        invoices = await generate(
            f"List the content of the folder with id {BOX_FOLDER_ID}",
            llm_client,
            session,
            tools,
        )
        print(f"Found {len(invoices)} invoices")

        cursor = connection.cursor()

        # Process each invoice and extract the required fields.
        for invoice in invoices:
            invoice_data = await extract_invoice_fields(invoice, llm_client, session, tools)
            print(f"Extracted data: {invoice_data}")

            cursor.execute(
                """
                INSERT INTO invoices (file, client, amount, product)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(file) DO UPDATE SET
                    client=excluded.client,
                    amount=excluded.amount,
                    product=excluded.product
                """,
                (
                    invoice_data["file"],
                    invoice_data["client_name"],
                    invoice_data["invoice_amount"],
                    invoice_data["product_name"],
                ),
            )
        
        connection.commit()


# ## Generating final reports

# Finally, you'll generate the same two reports using the data you stored in the database.

# In[ ]:


print("\nInvoice Report")

cursor = connection.cursor()
cursor.execute("SELECT COUNT(*), SUM(amount) FROM invoices")
total_invoices, total_amount = cursor.fetchone()

print(f"* Total invoices: {total_invoices}")
print(f"* Total amount: {total_amount}")

print("\nBreakdown by client:")
cursor.execute("SELECT client, COUNT(*), SUM(amount) FROM invoices GROUP BY client")
for row in cursor.fetchall():
    client, count, amount = row
    print(f"* {client}: {count} invoices (${amount})")

connection.close()


# ## Resources
# 
# - For a more detailed explanation on MCP, you can check [this course](https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/).
# - [MCP Documentation](https://modelcontextprotocol.io/docs/getting-started/intro).
