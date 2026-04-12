import os
from openai import OpenAI
from groq import Groq
from fastapi import Depends,status,HTTPException ,APIRouter
from CRUD import assistant as assist_crud
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from db import get_db
from allSchemas import Chat,ChatOut
from allModels import Assistant

load_dotenv()

# API_KEY = os.getenv("OPENAI_API_KEY")
# API_URL = "https://api.openai.com/v1/chat/completions"

# API_KEY = os.getenv("HUGGING_FACE_API_KEY")
# API_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"
# API_URL = "https://api-inference.huggingface.co/models/gpt2"


# API_KEY = os.getenv("OPEN_ROUTER")

# client = OpenAI(
#     base_url="https://openrouter.ai/api/v1",
#     api_key=API_KEY
# )

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


router = APIRouter(
    prefix='/chat',
    tags=['Chat']
)

@router.post("/assistant", response_model=ChatOut)
def chat(chat: Chat, db: Session = Depends(get_db)):
    db_result = assist_crud.fetch_from_db(chat, db)

    if not db_result:
        fallback_msg = (
            "Sorry, I couldn't find any relevant information in the database.\n\n"
            "👉 Try asking things like:\n"
            "- My room number\n"
            "- My payment status\n"
            "- My complaints\n"
            "- Leave details\n"
        )

        return ChatOut(
            email=chat.email,
            question=chat.question,
            isAdmin=chat.isAdmin,
            response=fallback_msg
        )

    system_prompt = """
    You are a hostel assistant chatbot.

    RULES:
    - Answer ONLY using the provided database information.
    - Do NOT add any extra knowledge.
    - If data is unclear, say it politely.
    - Keep answers short, clean, and structured.
    - Be polite and professional.
    """

    user_prompt = f"""
    User Question: {chat.question}
    Database Data: {db_result}

    Generate a helpful response.
    """

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=500,
        )

        answer = completion.choices[0].message.content

        if not answer.strip():
            answer = "Sorry, I couldn't generate a response based on the provided data."
            
        # if chat.isAdmin:
        #     greeting = "Hello Admin 👨‍💼"
        # else:
        #     greeting = "Hello Student 🎓"

        final_response = answer

        db_assistant = Assistant(
            student=None if chat.isAdmin else chat.email,
            question=chat.question,
            response=final_response,
            isAdmin=chat.isAdmin
        )

        db.add(db_assistant)
        db.commit()

        return ChatOut(
            email=chat.email,
            isAdmin=chat.isAdmin,
            question=chat.question,
            response=final_response
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))