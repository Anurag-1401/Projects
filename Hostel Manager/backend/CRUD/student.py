import json
import re
from uuid import uuid4
from fastapi import HTTPException
from sqlalchemy.orm import Session
from allModels import AdminCreate, Room, RoomAssignment,StudentAdded, StudentCreate
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


def Add_Bulk_Student(db: Session, data: dict):
    students = data.get("students", [])
    admin_email = data.get("admin_email")

    admin_obj = db.query(AdminCreate).filter(
        AdminCreate.email == admin_email
    ).first()

    if not admin_obj:
        raise HTTPException(status_code=400, detail="Invalid admin")

    existing_students = db.query(
        StudentAdded.reg_no,
        StudentAdded.email
    ).all()

    existing_reg_nos = {s.reg_no for s in existing_students}
    existing_emails = {s.email for s in existing_students}

    new_students = []
    skipped = []
    success = 0

    for s in students:
        reg_no = s.get("reg_no")
        email = s.get("email")

        if not reg_no or not email:
            skipped.append({
                "reg_no": reg_no,
                "reason": "Missing reg_no or email"
            })
            continue

        if reg_no in existing_reg_nos:
            skipped.append({
                "reg_no": reg_no,
                "reason": "Duplicate reg_no"
            })
            continue

        if email in existing_emails:
            skipped.append({
                "reg_no": reg_no,
                "reason": "Duplicate email"
            })
            continue

        new_student = StudentAdded(
            admin_id=admin_obj.id,
            reg_no=reg_no,
            name=s.get("name"),
            email=email,
            phone=s.get("phone"),
            department=s.get("department"),
            year=s.get("year"),
            DOB=s.get("DOB"),
            Addmission_Date=s.get("Addmission_Date"),
            Guardian_Name=s.get("Guardian_Name"),
            Guardian_Phone=s.get("Guardian_Phone"),
        )

        new_students.append(new_student)

        existing_reg_nos.add(reg_no)
        existing_emails.add(email)

        success += 1

    try:
        db.add_all(new_students)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "message": "Bulk upload completed",
        "total": len(students),
        "success": success,
        "skipped_count": len(skipped),
        "skipped": skipped
    }


def Edit_Student(id:int,db:Session,student:StudentAdd):
    existing=db.query(StudentAdded).filter(StudentAdded.id == id).first()
    if not existing:
        return None
    
    admin_obj = db.query(AdminCreate).filter(student.admin_email == AdminCreate.email).first()

    existing.admin_id = admin_obj.id
    existing.name = student.name
    existing.email = student.email
    existing.mac_address = student.mac_address
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


def is_valid_mac(mac: str):
    pattern = r"^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$"
    return re.match(pattern, mac)


def Edit(id:int,student:StudentUpdate,db:Session):
    
    existing=db.query(StudentAdded).filter(StudentAdded.id == id).first()
    if not existing:
        return None
    
    if student.mac_address:
        mac = student.mac_address.lower()

        if not is_valid_mac(mac):
            raise HTTPException(
                status_code=400,
                detail="Invalid MAC address format"
            )

        if existing.mac_address:
            if mac != existing.mac_address:
                raise HTTPException(
                    status_code=403,
                    detail="MAC address cannot be changed once set"
                )
        else:
            existing.mac_address = mac
    
    existing.Guardian_Name = student.Guardian_Name
    existing.Guardian_Phone = student.Guardian_Phone
    existing.phone = student.phone
    existing.DOB = student.DOB

    db.commit()
    db.refresh(existing)

    return existing


def deallocate_student(id: int, db: Session):
    student = db.query(StudentAdded).filter(StudentAdded.id == id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if not student.room_assignment_id:
        return {"message": "Already not allocated"}

    # 🔥 get assignment
    assignment = db.query(RoomAssignment).filter(
        RoomAssignment.id == student.room_assignment_id
    ).first()

    # 🔥 get room
    room = db.query(Room).filter(Room.roomNo == assignment.roomNo).first()

    # 🔥 remove student
    student.room_assignment_id = None

    # 🔥 update room
    room.occupied -= 1

    if room.occupied < room.capacity:
        room.status = "available"

    # 🔥 update assignment
    students = db.query(StudentAdded).filter(
        StudentAdded.room_assignment_id == assignment.id
    ).all()

    assignment.allocatedTo = json.dumps([s.name for s in students])
    assignment.available = room.capacity - len(students)

    db.commit()

    return True
   
    
def Del_Student(id: int, db: Session):
    student = db.query(StudentAdded).filter(StudentAdded.id == id).first()

    if not student:
        return None

    # 🔥 STEP 1: Remove from RoomAssignment (your existing logic)
    if student.room_assignment_id:
        assignment = db.query(RoomAssignment).filter(
            RoomAssignment.id == student.room_assignment_id
        ).first()

        if assignment:
            room = db.query(Room).filter(
                Room.roomNo == assignment.roomNo
            ).first()

            student.room_assignment_id = None

            if room and room.occupied > 0:
                room.occupied -= 1

                if room.occupied < room.capacity:
                    room.status = "available"

            remaining_students = db.query(StudentAdded).filter(
                StudentAdded.room_assignment_id == assignment.id
            ).all()

            assignment.allocatedTo = json.dumps([s.name for s in remaining_students])
            assignment.available = room.capacity - len(remaining_students)

            if len(remaining_students) == 0:
                db.delete(assignment)

    db.flush()  # 🔥 IMPORTANT

    # 🔥 STEP 2: DELETE from StudentCreate (VERY IMPORTANT)
    db.query(StudentCreate).filter(
        StudentCreate.authen_id == student.id
    ).delete()

    db.flush()  # 🔥 IMPORTANT

    # 🔥 STEP 3: DELETE student
    db.delete(student)

    db.commit()

    return {"message": "Student deleted successfully"}



def get_Students(email:str|None,db:Session):
    Students = db.query(StudentAdded).all()
    if not Students:
        None

    if email:
        return db.query(StudentAdded).filter(StudentAdded.email == email).first()

    return Students