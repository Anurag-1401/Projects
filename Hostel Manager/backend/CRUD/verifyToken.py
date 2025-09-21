import os
import json
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

# Load Firebase JSON from environment variable
firebase_json = os.environ.get("FIREBASE_JSON")
if not firebase_json:
    raise Exception("FIREBASE_JSON env variable not set")

cred_dict = json.loads(firebase_json)

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)

# Function to verify Firebase token
async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase token"
        )
