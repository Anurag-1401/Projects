from CRUD import verifyToken
from fastapi import APIRouter, Depends

router = APIRouter(
    prefix='/auth'
)

@router.get('/profile')
async def profile(user=Depends(verifyToken.get_current_user)):
    return{
        "message": "User verified successfully!",
        "uid": user["uid"],
        "email": user["email"],
        "provider": user["firebase"]["sign_in_provider"],
    }