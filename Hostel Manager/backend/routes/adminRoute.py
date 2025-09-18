from fastapi import Depends,status,HTTPException ,APIRouter
from CRUD import admin as ad_crud
from sqlalchemy.orm import Session
from db import get_db
from allSchemas import AdminOut,AdminNew,AdminLog

router = APIRouter(
    prefix='/admin',
    tags=['Amdin']
)


@router.post('/create',status_code=status.HTTP_201_CREATED)
def create(admin:AdminNew,db:Session = Depends(get_db)):
    Admin = ad_crud.create_Admin(db,admin)

    if not Admin:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail='Account Already Exists')
    
    return Admin


@router.post('/login',status_code=status.HTTP_200_OK)
def login(admin:AdminLog,db:Session = Depends(get_db)):
    Admin = ad_crud.login_Admin(db,admin)

    if not Admin:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail='Not Logged In')
    
    return Admin


@router.post('/google-create',status_code=status.HTTP_201_CREATED)
def byGoogle(admin:AdminNew,db:Session = Depends(get_db)):
    Admin = ad_crud.By_google_create(db,admin)

    if not Admin:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail='Account Already Exists')
    
    return Admin


@router.post('/google-login',status_code=status.HTTP_200_OK)
def byGoogle(admin:AdminLog,db:Session = Depends(get_db)):
    Admin = ad_crud.By_google_login(db,admin)

    if not Admin:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail='Admin Not Found')
    
    return Admin

             


@router.get('/get/{id}',status_code=status.HTTP_200_OK,response_model=AdminOut)
def getAd(id,db:Session=Depends(get_db)):
    Admin = ad_crud.get_Admin(id,db)

    if not Admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='Not Found')
    
    return Admin







