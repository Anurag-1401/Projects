from fastapi import status,HTTPException,APIRouter,Depends
from sqlalchemy.orm import Session
from CRUD import visitor as vis_crud
from db import get_db
from allSchemas import VisitorLogBase,VisitorLogOut,VisitorLogUpdate


router = APIRouter(
    prefix='/visitors',
    tags=['visitors']
)



@router.post('/add-visitor',status_code=status.HTTP_201_CREATED,response_model=VisitorLogOut)
def add_Visitor(visitor:VisitorLogBase,db:Session=Depends(get_db)):
    Visitor = vis_crud.add_visitor(visitor,db)

    if not Visitor:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Visitor



@router.put('/edit-visitor/{id}',status_code=status.HTTP_200_OK,response_model=VisitorLogOut)
def edit_Visitor(id:int,visitor:VisitorLogUpdate,db:Session=Depends(get_db)):
    Visitor = vis_crud.edit_visitor(id,visitor,db)

    if not Visitor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return Visitor



@router.get('/get-visitors',status_code=status.HTTP_200_OK,response_model=list[VisitorLogOut])
def get_Visitors(db:Session=Depends(get_db)):
    Visitors = vis_crud.get_visitors(db)

    if not Visitors:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return Visitors
