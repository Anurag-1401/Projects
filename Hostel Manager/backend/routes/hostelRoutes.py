from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from CRUD import hostel as ho_crud
from allSchemas import HostelCreate, HostelOut


router = APIRouter(
    prefix="/hostel",
    tags=["Hostel"]
)


@router.post("/add", status_code=status.HTTP_201_CREATED, response_model=HostelOut)
def create(hostel: HostelCreate, db: Session = Depends(get_db)):
    new_hostel = ho_crud.Add_Hostel(hostel, db)

    if not new_hostel:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hostel already exists"
        )

    return new_hostel


@router.put("/edit/{id}", status_code=status.HTTP_200_OK, response_model=HostelOut)
def update(id: int, hostel: HostelCreate, db: Session = Depends(get_db)):
    updated = ho_crud.Edit_Hostel(id, hostel, db)

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hostel not found"
        )

    return updated


@router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
def delete(id: int, db: Session = Depends(get_db)):
    deleted = ho_crud.Del_Hostel(id, db)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hostel not found"
        )

    return deleted


@router.get("/get-hostels", status_code=status.HTTP_200_OK, response_model=list[HostelOut])
def get_all(db: Session = Depends(get_db)):
    hostels = ho_crud.Get_Hostels(db)

    if not hostels:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hostels found"
        )

    return hostels