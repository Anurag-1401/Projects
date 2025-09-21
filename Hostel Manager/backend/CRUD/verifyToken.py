import os
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

security = HTTPBearer()

firebase_json = os.environ.get("FIREBASE_JSON")
if not firebase_json:
    raise Exception("FIREBASE_JSON env variable not set")

cred_dict = json.loads(firebase_json)

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase token"
        )



# import os
# import json
# import firebase_admin
# from firebase_admin import credentials, auth
# from fastapi import Depends, HTTPException, status
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# security = HTTPBearer()

# # Path to your Firebase JSON file
# firebase_json_path = r"C:\Working\Projects\Hostel Manager\backend\hostel-management-29452-firebase-adminsdk-fbsvc-6a8733b698.json"

# # Load JSON from file
# with open(firebase_json_path) as f:
#     cred_dict = json.load(f)

# # Initialize Firebase app
# if not firebase_admin._apps:
#     cred = credentials.Certificate(cred_dict)
#     firebase_admin.initialize_app(cred)

# # Dependency to verify token
# async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
#     try:
#         decoded_token = auth.verify_id_token(token.credentials)
#         return decoded_token
#     except Exception:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid Firebase token"
#         )
