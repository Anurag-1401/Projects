import os
import json
import pandas as pd
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from google import genai

_ = load_dotenv(override=True)

MODEL_NAME = "gemini-2.5-flash"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PDF_FOLDER = "student_pdfs"

llm_client = genai.Client(api_key=GEMINI_API_KEY)

def parse_json(content):
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return content

def extract_student_fields(file: str, text: str):
    """
    Extract student info from the supplied text.
    """
    print(f"Extracting data from {file}...")

    prompt = f"""
    Extract the following information from this student exam record:

    1. Name (string)
    2. Branch (string)
    3. Year (int)
    4. Subject (string)
    5. Marks (int)

    Return result as JSON with keys:
    name, branch, year, subject, marks

    Student record text:
    {text}
    """

    try:
        response = llm_client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        result = parse_json(response.candidates[0].content.parts[0].text)
        result["file"] = file
        print(json.dumps(result, indent=4))
        return result
    except Exception as e:
        print(f"Failed to extract data. Exception: {e}")
        return None

# Collect data
data = []

for file in os.listdir(PDF_FOLDER):
    if file.endswith(".pdf"):
        reader = PdfReader(os.path.join(PDF_FOLDER, file))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        student_data = extract_student_fields(file, text)
        if student_data:
            data.append(student_data)

# Save to Excel
df = pd.DataFrame(data)
df.to_excel("student_results.xlsx", index=False)
print("\n✅ Data saved to student_results.xlsx")
