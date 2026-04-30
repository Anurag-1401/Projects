from sqlalchemy.orm import Session
from allModels import Hostels
from allSchemas import HostelCreate


def Add_Hostel(hostel: HostelCreate, db: Session):
    existing = db.query(Hostels).filter(Hostels.name == hostel.name).first()

    if existing:
        return None

    db_hostel = Hostels(
        name=hostel.name,
        location=hostel.location,
        total_wings_per_hostel=hostel.total_wings_per_hostel,
        total_floors_per_wing=hostel.total_floors_per_wing,
        total_rooms_per_floor_per_wing=hostel.total_rooms_per_floor_per_wing,
        createdBy=hostel.createdBy
    )

    db.add(db_hostel)
    db.commit()
    db.refresh(db_hostel)

    return db_hostel


def Edit_Hostel(id: int, hostel: HostelCreate, db: Session):
    existing = db.query(Hostels).filter(Hostels.id == id).first()

    if not existing:
        return None

    existing.name = hostel.name
    existing.location = hostel.location
    existing.total_wings_per_hostel = hostel.total_wings_per_hostel
    existing.total_floors_per_wing = hostel.total_floors_per_wing
    existing.total_rooms_per_floor_per_wing = hostel.total_rooms_per_floor_per_wing

    db.commit()
    db.refresh(existing)

    return existing


def Del_Hostel(id: int, db: Session):
    existing = db.query(Hostels).filter(Hostels.id == id).first()

    if not existing:
        return None

    db.delete(existing)
    db.commit()

    return {"message": "Hostel deleted successfully"}


def Get_Hostels(db: Session):
    hostels = db.query(Hostels).all()

    if not hostels:
        return None

    return hostels