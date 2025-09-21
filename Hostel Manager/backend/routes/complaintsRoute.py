from fastapi import status,HTTPException,APIRouter,Depends
from typing import Optional
from sqlalchemy.orm import Session
from CRUD import complaint as com_crud
from db import get_db
from allSchemas import ComplaintCreate,ComplaintUpdate,ComplaintOut


router = APIRouter(
    prefix='/complaint',
    tags=['complaint']
)



@router.post('/add-complaint',status_code=status.HTTP_201_CREATED)
def add_Complaint(complaint:ComplaintCreate,db:Session=Depends(get_db)):
    Complaint = com_crud.add_complaint(complaint,db)

    if not Complaint:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Complaint



@router.put('/edit-complaint/{id}',status_code=status.HTTP_200_OK,response_model=ComplaintOut)
def edit_Complaint(id:int,complaint:ComplaintUpdate,db:Session=Depends(get_db)):
    Complaint = com_crud.edit_complaint(id,complaint,db)

    if not Complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return Complaint



@router.get('/get-complaints',status_code=status.HTTP_200_OK,response_model=list[ComplaintOut])
def get_Complaints(name:Optional[str]=None,db:Session=Depends(get_db)):
    Complaints = com_crud.get_complaints(name,db)

    if not Complaints:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return Complaints
