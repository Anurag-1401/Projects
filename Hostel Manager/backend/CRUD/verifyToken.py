import os
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials,initialize_app
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

firebase_json = os.getenv("FIREBASE_JSON")

if not firebase_json:
    raise Exception("FIREBASE_JSON not set")

cred_dict = json.loads(firebase_json)

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_dict)
    initialize_app(cred)

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase token"
        )