#!/usr/bin/env python
# coding: utf-8

# # Processing Invoices Using a Multi-Agent System
# 

# In this lesson, you will transform your application into a multi-agent system consisting of specialized agents communicating through A2A (Agent-to-Agent).

# In[ ]:


import warnings
warnings.filterwarnings('ignore')


# You'll use Google's ADK or Agent Development Kit to define each agent in the multi-agent system. Note that each agent is MCP compliant, meaning you can connect it to any MCP server by simply defining the server's parameter configuration.

# In[ ]:


import os

from google.adk.agents import Agent
from google.adk.agents.remote_a2a_agent import RemoteA2aAgent
from google.adk.artifacts import InMemoryArtifactService
from google.adk.memory.in_memory_memory_service import InMemoryMemoryService
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools.mcp_tool.mcp_toolset import (
    MCPToolset,
    StdioServerParameters,
    StdioConnectionParams,
)


# The following are all the required libraries from [A2A](https://a2a-protocol.org/latest/) to let the agents communicate through A2A.

# In[ ]:


from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import (
    AgentCapabilities,
    AgentCard,
    AgentSkill,
    MessageSendParams,
    SendMessageRequest,
)
from a2a.utils.constants import AGENT_CARD_WELL_KNOWN_PATH
from a2a.client import A2AClient

from google.adk.a2a.executor.a2a_agent_executor import (
    A2aAgentExecutor,
    A2aAgentExecutorConfig,
)

import asyncio
import threading
import time
import json
from typing import Any
import uuid
import httpx
import nest_asyncio
import uvicorn


from dotenv import load_dotenv
_ = load_dotenv(override=True)


# <div style="background-color:#fff6ff; padding:13px; border-width:3px; border-color:#efe6ef; border-style:solid; border-radius:6px">
# <p>💻 &nbsp; <b>To access the <code>requirements.txt</code>, <code>env.example</code> and the MCP server files:</b> 1) click the <em>"File"</em> option in the top menu of the notebook 2) click <em>"Open"</em>.
# 
# <p>⬇ &nbsp; <b>Download Notebooks:</b> 1) click the <em>"File"</em> option in the top menu of the notebook and then 2) click <em>"Download as"</em> and select <em>"Notebook (.ipynb)"</em>.</p>
# </div>

# Here, you'll define the three local ports that each of the agents will use to listen for requests in this local lab environment.
# 
# The other variables include:
# - The folder ID pointing to the Box folder 
# - and the path to the MCP server

# In[ ]:


MODEL_NAME = "gemini-2.5-pro"

FILES_AGENT_PORT = 10024
EXTRACTION_AGENT_PORT = 10025
ORCHESTRATOR_AGENT_PORT = 10026

BOX_FOLDER_ID = os.getenv("BOX_FOLDER_ID")
BOX_MCP_SERVER_PATH = "./mcp-server-box"

# Apply nest_asyncio to allow nested event loops in Jupyter
nest_asyncio.apply()


# ## Configuring access to Box's MCP Server

# In[ ]:


connection_params = StdioConnectionParams(
    server_params=StdioServerParameters(
        command="uv",
        args=[
            "--directory",
            BOX_MCP_SERVER_PATH,
            "run",
            "src/mcp_server_box.py",
        ],
        timeout=60,
    )
)


# ## Creating the Agents

# You'll create three agents:
# 
# 1. Files Agent - Returns every file inside a specified folder in Box.
# 2. Extraction Agent - Extracts structure data from a specific document stored in Box.
# 3. Orchestrator Agent - Orchestrates the work of the other agents.

# ### Agent 1 - Files Agent
# 
# This agent will list the IDs of all files inside a given folder.

# In[ ]:


files_agent = Agent(
    model=MODEL_NAME,
    name="files_agent",
    instruction="""
    Your job is to list the ID of every file inside the folder with the given ID.
    """,
    tools=[
        MCPToolset(
            connection_params=connection_params,
            tool_filter=["box_list_folder_content_by_folder_id"],
        )
    ],
)


# Let's now create the Agent Card. The Agent Card outlines the agent's capabilities and determines if this agent can assist with a specific task.

# In[ ]:


files_agent_card = AgentCard(
    name="Files Agent",
    #url=f"http://localhost:{FILES_AGENT_PORT}",
    url=os.getenv('DLAI_LOCAL_URL').format(port=FILES_AGENT_PORT),
    description="List files in a folder given its folder ID.",
    version="1.0",
    capabilities=AgentCapabilities(streaming=True),
    default_input_modes=["text/plain"],
    default_output_modes=["text/plain"],
    skills=[
        AgentSkill(
            id="list_files_in_folder",
            name="List existing files in a folder",
            description="List files in a folder given its folder ID.",
            tags=["files", "folder", "find", "list"],
            examples=["List files in folder 12345"],
        )
    ],
)


# Once you have the Agent Card, you'll set up a remote A2A instance to enable the Orchestrator to communicate with this ADK agent using A2A.

# In[ ]:


remote_files_agent = RemoteA2aAgent(
    name="list_files_in_folder",
    description="List files in a folder given the folder ID.",
    #agent_card=f"http://localhost:{Files_AGENT_PORT}{AGENT_CARD_WELL_KNOWN_PATH}",
    agent_card=os.getenv('DLAI_LOCAL_URL').format(port=FILES_AGENT_PORT)[:-1]+AGENT_CARD_WELL_KNOWN_PATH,
)

print(AGENT_CARD_WELL_KNOWN_PATH)


# **Note:** The agent card has an endpoint that ends with what you just printed. This endpoint will be used by the orchestrator to get information about the remote files agent.

# ### Agent 2 - Extraction Agent
# 
# This agent will extract invoice data from a file in Box. You'll instruct the agent to extract the client name, invoice amount, and product name, and return everything as a JSON object in a specific format.

# In[ ]:


extraction_agent = Agent(
    model=MODEL_NAME,
    name="data_extraction_agent",
    instruction="""
    Your job is to extract invoice data from a file given its ID.

    You will receive the ID of a file. You will extract the following fields from that file:
    client_name, invoice_amount, product_name.

    You MUST return your response in the following JSON format:
    {
        "ID": "<file_id>",
        "client_name": "<name_of_the_client>",
        "invoice_amount": <amount>,
        "product_name": "<name_of_the_product>"
    }

    Only return the JSON object, no additional text, and no markdown formatting.
    """,
    tools=[
        MCPToolset(
            connection_params=connection_params,
            tool_filter=["box_ai_extract_freeform_tool"],
        )
    ],
)


# Let's now create the Agent Card.

# In[ ]:


extraction_agent_card = AgentCard(
    name="Invoice Data Extraction Agent",
    #url=f"http://localhost:{EXTRACTION_AGENT_PORT}",
    url = os.getenv('DLAI_LOCAL_URL').format(port=EXTRACTION_AGENT_PORT),
    description="Extract invoice data from a given file",
    version="1.0",
    capabilities=AgentCapabilities(streaming=True),
    default_input_modes=["text/plain", "application/json"],
    default_output_modes=["text/plain", "application/json"],
    skills=[
        AgentSkill(
            id="extract_invoice_data_from_file",
            name="Extract Invoice Data From File",
            description="Extracts invoice data from a specific file",
            tags=["extract", "data"],
            examples=[
                "Extract invoice data from file ID 12345",
                '{"file_id": "67890"}',
            ],
        )
    ],
)


# Let's also create the remote instance for this agent.

# In[ ]:


remote_extraction_agent = RemoteA2aAgent(
    name="extract_invoice_data_from_file",
    description="Extracts invoice data from a specific file",
    #agent_card=f"http://localhost:{EXTRACTION_AGENT_PORT}{AGENT_CARD_WELL_KNOWN_PATH}",
    agent_card=os.getenv('DLAI_LOCAL_URL').format(port=EXTRACTION_AGENT_PORT)[:-1]+AGENT_CARD_WELL_KNOWN_PATH,
)


# ### Agent 3 - Orchestrator Agent
# 
# This agent will coordinate between the other agents to process every invoice in Box and extract their data.

# In[ ]:


orchestrator_agent = Agent(
    model=MODEL_NAME,
    name="orchestrator_agent",
    instruction="""
You are an expert AI Orchestrator.

Your primary responsibility is to interpret user requests, plan the necessary
sequence of actions if multiple steps are involved, and delegate them to the
most appropriate specialized remote agents.

You do not perform the tasks yourself but manage their assignment, sequence, 
and can monitor their status.

* Always prioritize selecting the correct agent(s) based on their documented purpose.
* Ensure all information required by the chosen remote agent is included in the
  call, including outputs from previous agents if it's a sequential task.
* Focus on the most recent parts of the conversation for immediate context, 
  but maintain awareness of the overall goal, especially for multi-step requests.
""",
    sub_agents=[remote_files_agent, remote_extraction_agent],
)


# Let's now create the Agent Card.

# In[ ]:


orchestrator_agent_card = AgentCard(
    name="Orchestrator Agent",
    #url=f"http://localhost:{ORCHESTRATOR_AGENT_PORT}",
    url=os.getenv('DLAI_LOCAL_URL').format(port=ORCHESTRATOR_AGENT_PORT),
    description="Orchestrates listing files in folders and extracting invoice data from them",
    version="1.0",
    capabilities=AgentCapabilities(streaming=True),
    default_input_modes=["text/plain"],
    default_output_modes=["text/plain", "application/json"],
    skills=[
        AgentSkill(
            id="list_files_and_extract_data",
            name="List Files and Extract Data",
            description="Lists files in a folder and extracts invoice data from them",
            tags=["files", "extract", "orchestration"],
            examples=[
                "List files in folder 123",
                "Process folder 123",
                "Extract invoice data from file 123",
            ],
        )
    ],
)


# ## Running the agents

# Let's define functions to start a server for any given agent and run it in the background.
# 
# In this first function, the Runner instance provides the execution environment for each ADK agent. So this instance is required anytime you define an agent with ADK. It manages the execution of an agent within a session, handling message processing, event generation, and interaction with various services like artifact storage, session management, and memory.
# 
# The second important instance is the A2AAgentExecutor: the Agent executor acts as the bridge between the A2A protocol and your agent's specific logic. It receives context about the request and uses an event queue to communicate results or updates back.
# 
# The DefaultRequestHandler instance will then process this queue to send the response to the user who requested the query.
# 
# Finally you need to wrap the request_handler and the agent card in an `A2AStarletteApplication` instance which you can use to run the A2A agent server.

# In[ ]:


def create_agent_a2a_server(agent, agent_card):
    """Create an A2A server for the supplied agent."""
    runner = Runner(
        app_name=agent.name,
        agent=agent,
        artifact_service=InMemoryArtifactService(),
        session_service=InMemorySessionService(),
        memory_service=InMemoryMemoryService(),
    )

    config = A2aAgentExecutorConfig()
    executor = A2aAgentExecutor(runner=runner, config=config)

    request_handler = DefaultRequestHandler(
        agent_executor=executor,
        task_store=InMemoryTaskStore(),
    )

    return A2AStarletteApplication(agent_card=agent_card, 
                                   http_handler=request_handler)


# Now to launch each agent as an A2A server, you could have the definition of each agent in a separate python file (as shown in this [example](https://a2a-protocol.org/latest/tutorials/python/5-start-server/)) and then start the server of each agent in a different terminal. In this lesson, however, you're going to launch each agent from this notebook environment, and for that you are provided with these special functions.

# In[ ]:


servers = []


async def run_server_notebook(create_agent_function, port):
    """Run server with proper error handling."""
    try:
        print(f"\nStarting agent on port {port}...")
        app = create_agent_function()
        config = uvicorn.Config(
            #app.build(), host="127.0.0.1", port=port, log_level="error", loop="asyncio"
            app.build(), host="0.0.0.0", port=port, log_level="error", loop="asyncio"
        )
        server = uvicorn.Server(config)
        servers.append(server)
        await server.serve()
    except Exception as e:
        print(f"Error running agent server: {e}")


def run_agent_in_background(create_agent_function, port, name):
    """Run an agent server in a background thread."""

    def run():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(run_server_notebook(create_agent_function, port))
        except Exception as e:
            print(f"{name} error: {e}")

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
    return thread


# Let's now start the agent servers.

# In[ ]:


files_thread = run_agent_in_background(
    lambda: create_agent_a2a_server(files_agent, files_agent_card),
    FILES_AGENT_PORT,
    "Files Agent",
)

extraction_thread = run_agent_in_background(
    lambda: create_agent_a2a_server(extraction_agent, extraction_agent_card),
    EXTRACTION_AGENT_PORT,
    "Invoice Data Extraction Agent",
)

orchestrator_thread = run_agent_in_background(
    lambda: create_agent_a2a_server(orchestrator_agent, orchestrator_agent_card),
    ORCHESTRATOR_AGENT_PORT,
    "Orchestrator Agent",
)


# **Note:** If you receive a message that the agents are already running on the given port numbers (in case you decided to run the notebooks twice), make sure first to shut down the notebook's kernel and then re-run the notebook. To shut down the notebook's kernel, you can click on the `Kernel` tab in the top-level menu and then on `shutdown`.

# Let's wait for the servers to start and check if every agent is running.

# In[ ]:


time.sleep(3)

if (
    files_thread.is_alive()
    and extraction_thread.is_alive()
    and orchestrator_thread.is_alive()
):
    print("Agent servers are running.")
else:
    print("Agent servers failed to start.")


# ## Running the Multi-Agent system

# Now that everything is up, you'll create an A2A client that will help you connect to any A2A agent server. You can think of it as an interface that receives the user's request and sends the request to the agent it's connected to.
# 
# In this case, you will connect the A2A client to the orchestrator, and the orchestrator will analyze the request and forward the requests to the specialized agent.

# In[ ]:


class A2ASimpleClient:
    def __init__(self, default_timeout: float = 3600.0):
        self._agent_info_cache: dict[
            str, dict[str, Any] | None
        ] = {}  # Cache for agent metadata
        self.default_timeout = default_timeout

    async def create_task(self, agent_url: str, message: str) -> str:
        """Send a message following the official A2A SDK pattern."""
        # Configure httpx client with timeout
        timeout_config = httpx.Timeout(
            timeout=self.default_timeout,
            connect=10.0,
            read=self.default_timeout,
            write=10.0,
            pool=5.0,
        )

        async with httpx.AsyncClient(timeout=timeout_config) as httpx_client:
            # Check if we have cached agent card data
            if (
                agent_url in self._agent_info_cache
                and self._agent_info_cache[agent_url] is not None
            ):
                agent_card_data = self._agent_info_cache[agent_url]
            else:
                # Fetch the agent card
                agent_card_response = await httpx_client.get(
                    f"{agent_url}"[:-1]+f"{AGENT_CARD_WELL_KNOWN_PATH}"
                )
                agent_card_data = self._agent_info_cache[agent_url] = (
                    agent_card_response.json()
                )

            # Create AgentCard from data
            agent_card = AgentCard(**agent_card_data)

            # Create A2A client with the agent card
            client = A2AClient(httpx_client=httpx_client, agent_card=agent_card)

            # Build the message parameters following official structure
            send_message_payload = {
                "message": {
                    "role": "user",
                    "parts": [{"kind": "text", "text": message}],
                    "messageId": uuid.uuid4().hex,
                }
            }

            # Create the request
            request = SendMessageRequest(
                id=str(uuid.uuid4()), params=MessageSendParams(**send_message_payload)
            )

            # Send the message with timeout configuration
            response = await client.send_message(request)

            # Extract text from response
            try:
                response_dict = response.model_dump(mode="json", exclude_none=True)

                if "result" in response_dict and "artifacts" in response_dict["result"]:
                    artifacts = response_dict["result"]["artifacts"]
                    for artifact in artifacts:
                        if "parts" in artifact:
                            for part in artifact["parts"]:
                                if "text" in part:
                                    return part["text"]

                # If we couldn't extract text, return the full response as formatted JSON
                return json.dumps(response_dict, indent=2)

            except Exception as e:
                print(f"Error parsing response: {e}")
                return str(response)


a2a_client = A2ASimpleClient()


# Let's now ask the orchestrator agent to list every file in a folder. 
# 
# **Notes:** 
# 
# - If you receive this warning,
# 
#     ```
#     Warning: there are non-text parts in the response: ['thought_signature', 'function_call'], returning concatenated text result from text parts. Check the full candidates.content.parts accessor to get the full model response. auth_config or auth_config.auth_scheme is missing. Will skip authentication.Using FunctionTool instead if authentication is not required.
#     ```
# 
#     you don't need to worry about it, you can ignore it.
# 
# - The following two cells might take a few minutes to generate a response.

# In[ ]:


report = await a2a_client.create_task(
    os.getenv('DLAI_LOCAL_URL').format(port=ORCHESTRATOR_AGENT_PORT),
    f"List files in folder {BOX_FOLDER_ID}.",
)

print(report)


# You can also ask the orchestrator to extract data from a specific file.

# In[ ]:


report = await a2a_client.create_task(
    os.getenv('DLAI_LOCAL_URL').format(port=ORCHESTRATOR_AGENT_PORT),
    "Extract data from file 1956535377108",
)

print(report)


# ## Resources

# - [A2A Documentation](https://a2a-protocol.org/latest/)
# - [A2A Introduction in ADK documentation](https://google.github.io/adk-docs/a2a/intro/)
