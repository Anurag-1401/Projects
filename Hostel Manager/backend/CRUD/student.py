from uuid import uuid4
from fastapi import HTTPException
from sqlalchemy.orm import Session
from allModels import AdminCreate,StudentAdded
from allSchemas import StudentAdd,StudentUpdate



def Add_Student(db:Session,student:StudentAdd):
    existing=db.query(StudentAdded).filter(StudentAdded.email == student.email).first()
    if existing:
        return None
    
    admin_obj = db.query(AdminCreate).filter(student.admin_email == AdminCreate.email).first()
    db_addStu = StudentAdded(
        admin_id = admin_obj.id,
        name = student.name,
        Guardian_Name = student.Guardian_Name,
        Guardian_Phone = student.Guardian_Phone,
        reg_no = student.reg_no,
        email = student.email,
        phone = student.phone,
        department = student.department,
        year = student.year,
        DOB = student.DOB,
        Addmission_Date = student.Addmission_Date
    )

    db.add(db_addStu)
    db.commit()
    db.refresh(db_addStu)
    return db_addStu



def Edit_Student(id:int,db:Session,student:StudentAdd):
    existing=db.query(StudentAdded).filter(StudentAdded.id == id).first()
    if not existing:
        return None
    
    admin_obj = db.query(AdminCreate).filter(student.admin_email == AdminCreate.email).first()

    existing.admin_id = admin_obj.id
    existing.name = student.name
    existing.email = student.email
    existing.Guardian_Name = student.Guardian_Name
    existing.Guardian_Phone = student.Guardian_Phone
    existing.reg_no = student.reg_no
    existing.phone = student.phone
    existing.department = student.department
    existing.year = student.year
    existing.DOB = student.DOB
    existing.Addmission_Date = student.Addmission_Date


    db.commit()
    db.refresh(existing)

    return existing

def Edit(id:int,student:StudentUpdate,db:Session):
    
    existing=db.query(StudentAdded).filter(StudentAdded.id == id).first()
    if not existing:
        return None
    
    existing.Guardian_Name = student.Guardian_Name
    existing.Guardian_Phone = student.Guardian_Phone
    existing.phone = student.phone
    existing.DOB = student.DOB

    db.commit()
    db.refresh(existing)

    return existing
   
    

def Del_Student(id:int,db:Session):
    existing = db.query(StudentAdded).filter(StudentAdded.id == id).first()
    if not existing:
        return None
    
    db.delete(existing)
    db.commit()
    return existing



def get_Students(email:str|None,db:Session):
    Students = db.query(StudentAdded).all()
    if not Students:
        None

    if email:
        return db.query(StudentAdded).filter(StudentAdded.email == email).first()

    return Students