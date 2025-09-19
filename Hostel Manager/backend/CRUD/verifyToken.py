import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials

# Default path for Render
FIREBASE_SECRET_PATH = "/etc/secrets/firebase-key.json"

# Local fallback path (adjust to your local file path)
LOCAL_SECRET_PATH = "/home/andy/working/Hostel Manager/backend/hostel-management-29452-firebase-adminsdk-fbsvc-6a8733b698.json"

# Use Render secret if available, otherwise local file
cred_path = FIREBASE_SECRET_PATH if os.path.exists(FIREBASE_SECRET_PATH) else LOCAL_SECRET_PATH

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

security = HTTPBearer()

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase token"
        )
