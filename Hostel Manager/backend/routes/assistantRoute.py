import os
from openai import OpenAI
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


API_KEY = os.getenv("OPEN_ROUTER")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY
)


router = APIRouter(
    prefix='/chat',
    tags=['Chat']
)

@router.post("/assistant", status_code=status.HTTP_201_CREATED, response_model=ChatOut)
def chat(chat: Chat, db: Session = Depends(get_db)):
    db_result = assist_crud.fetch_from_db(chat, db)

    if not db_result:
        # return ChatOut(
        # email=chat.email,
        # question=chat.question,
        # response="Sorry, I could not find any information related to your question."
        # )
        db_result = ""

    prompt = f"""
    Student asked: "{chat.question}"
    Database info: {db_result}

    Please answer politely and clearly using only database info.
    """

    try:
        completion = client.chat.completions.create(
            model="google/gemini-2.5-pro",
            max_tokens=1000,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        answer = "".join([choice.message.content for choice in completion.choices if choice.message.content])

        db_assistant = Assistant(
            student=chat.email,
            question=chat.question,
            response=answer,
        )

        db.add(db_assistant)
        db.commit()
        db.refresh(db_assistant)

        return ChatOut(
            email=chat.email,
            question=chat.question,
            response=answer
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))