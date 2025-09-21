from fastapi import status,HTTPException,APIRouter,Depends
from sqlalchemy.orm import Session
from CRUD import room as ro_crud
from db import get_db
from allSchemas import RoomOut,RoomCreate,RoomAssignmentCreate,RoomAssignmentOut


router = APIRouter(
    prefix='/room',
    tags=['Room']
)




@router.post('/add-room',status_code=status.HTTP_201_CREATED,response_model=RoomOut)
def create(room:RoomCreate,db:Session=Depends(get_db)):
    Room = ro_crud.Add_Room(room,db)

    if not Room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Created")
    
    return Room


@router.put('/edit-room/{id}',status_code=status.HTTP_200_OK,response_model=RoomOut)
def create(id:int,room:RoomCreate,db:Session=Depends(get_db)):
    Room = ro_crud.Edit_Room(id,room,db)

    if not Room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Created")
    
    return Room


@router.delete('/del-room/{id}',status_code=status.HTTP_200_OK,response_model=RoomOut)
def create(id:int,db:Session=Depends(get_db)):
    Room = ro_crud.Del_Room(id,db)

    if not Room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Created")
    
    return Room


@router.get('/get-rooms',status_code=status.HTTP_200_OK,response_model=list[RoomOut])
def get(db:Session=Depends(get_db)):
    Rooms = ro_crud.Get_Room(db)
    if not Rooms:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return Rooms


@router.post('/assignment',status_code=status.HTTP_201_CREATED,response_model=RoomAssignmentOut)
def assign(roomAssign:RoomAssignmentCreate,db:Session=Depends(get_db)):
    Assignment = ro_crud.Assign_Room(roomAssign,db)

    if not Assignment:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    return Assignment


@router.get('/get-assignment',status_code=status.HTTP_200_OK,response_model=list[RoomAssignmentOut])
def get(db:Session=Depends(get_db)):
    RoomsAssigned = ro_crud.Get_Room_Assigned(db)
    if not RoomsAssigned:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return RoomsAssigned