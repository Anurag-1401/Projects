from fastapi import Depends,status,HTTPException ,APIRouter
from CRUD import studentLogin as st_crud
from sqlalchemy.orm import Session
from db import get_db
from allSchemas import StudentNew,StudentLog,StudentOutLogin

router = APIRouter(
    prefix='/studentLogin',
    tags=['StudentLogin']
)





@router.post('/create',status_code=status.HTTP_201_CREATED,response_model=StudentOutLogin)
def create(student:StudentNew,db:Session = Depends(get_db)):
    Student = st_crud.create_Student(db,student)

    if not Student:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail='Student Already Exists')
    
    return Student

@router.put('/edit/{id}',status_code=status.HTTP_200_OK,response_model=StudentOutLogin)
def edit(id:int,student:StudentNew,db:Session = Depends(get_db)):
    Student = st_crud.edit_Student(id,student,db)

    if not Student:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail='Failed to edit student')
    
    return Student


@router.post('/login',status_code=status.HTTP_200_OK,response_model=StudentOutLogin)
def login(student:StudentLog,db:Session = Depends(get_db)):
    Student = st_crud.login_Student(db,student)

    if not Student:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail='Student Not Found')
    
    return Student


@router.post('/google-create',status_code=status.HTTP_201_CREATED,response_model=StudentOutLogin)
def byGoogle(student:StudentNew,db:Session = Depends(get_db)):
    Student = st_crud.By_google_create(db,student)

    if not Student:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail='Student Already Exists')
    
    return Student


@router.post('/google-login',status_code=status.HTTP_200_OK,response_model=StudentOutLogin)
def byGoogle(student:StudentLog,db:Session = Depends(get_db)):
    Student = st_crud.By_google_login(db,student)

    if not Student:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail='Account Not Found')
    
    return Student

             


@router.get('/get/{id}',status_code=status.HTTP_200_OK,response_model=StudentOutLogin)
def getStudent(id:int,db:Session=Depends(get_db)):
    Student = st_crud.get_Student(id,db)

    if not Student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='Student Not Found')
    
    return Student


