from fastapi import status,HTTPException,APIRouter,Depends
from typing import Optional
from sqlalchemy.orm import Session
from CRUD import leave as le_crud
from db import get_db
from allSchemas import LeaveApplicationCreate,LeaveApplicationUpdate,LeaveApplicationOut


router = APIRouter(
    prefix='/leave',
    tags=['leave Application']
)



@router.post('/add-leave',status_code=status.HTTP_201_CREATED)
def addLeave(leave:LeaveApplicationCreate,db:Session=Depends(get_db)):
    leaveApplication = le_crud.add_leave(leave,db)

    if not leaveApplication:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return leaveApplication



@router.put('/edit-leave/{id}',status_code=status.HTTP_200_OK,response_model=LeaveApplicationOut)
def editLeave(id:int,leave:LeaveApplicationUpdate,db:Session=Depends(get_db)):
    leaveApplication = le_crud.edit_leave(id,leave,db)

    if not leaveApplication:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return leaveApplication



@router.get('/get-leaves',status_code=status.HTTP_200_OK,response_model=list[LeaveApplicationOut])
def getLeaves(name:Optional[str] = None,db:Session=Depends(get_db)):
    leaveApplications = le_crud.get_leaves(name,db)

    if not leaveApplications:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return leaveApplications
