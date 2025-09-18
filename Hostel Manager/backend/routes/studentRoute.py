from fastapi import Depends,status,HTTPException ,APIRouter
from typing import Optional
from CRUD import student as ad_crud
from sqlalchemy.orm import Session
from db import get_db
from allSchemas import StudentAdd,StudentOut,StudentUpdate

router = APIRouter(
    prefix='/student',
    tags=['Student']
)





@router.post('/add-student',status_code=status.HTTP_201_CREATED,response_model=StudentOut)
def addStudent(student:StudentAdd,db:Session = Depends(get_db)):
    Student = ad_crud.Add_Student(db,student)

    if not Student:
        raise HTTPException(status_code=status.HTTP_208_ALREADY_REPORTED)
    
    return Student


@router.put('/edit-student/{id}',status_code=status.HTTP_200_OK,response_model=StudentOut)
def editStudent(id:int,student:StudentAdd,db:Session = Depends(get_db)):
    Student = ad_crud.Edit_Student(id,db,student)

    if not Student:
        raise HTTPException(status_code=status.HTTP_208_ALREADY_REPORTED)
    
    return Student


@router.put('/edit/{id}',status_code=status.HTTP_200_OK)
def editStudent(id:int,student:StudentUpdate,db:Session = Depends(get_db)):
    Student = ad_crud.Edit(id,student,db)

    if not Student:
        raise HTTPException(status_code=status.HTTP_208_ALREADY_REPORTED)
    
    return Student

@router.delete('/del-student/{id}',status_code=status.HTTP_200_OK,response_model=StudentOut)
def delStudent(id:int,db:Session = Depends(get_db)):
    Student = ad_crud.Del_Student(id,db)

    if not Student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return Student

@router.get('/get-students',status_code=status.HTTP_200_OK,response_model=list[StudentOut]|StudentOut)
def getStudents(email:Optional[str]=None,db:Session = Depends(get_db)):
    Students = ad_crud.get_Students(email,db)

    if not Students:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return Students