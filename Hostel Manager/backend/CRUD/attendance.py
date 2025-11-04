from sqlalchemy import func
from datetime import datetime,date
from sqlalchemy.orm import Session
from allModels import Attendance,StudentAdded
from allSchemas import AttendanceCreate



def get_status(date_obj: datetime | None) -> str:
    if not date_obj:
        return "absent"

    total_minutes = date_obj.hour * 60 + date_obj.minute
    early_threshold = 20 * 60 + 30   
    late_threshold = 23 * 60      

    if total_minutes < early_threshold:
        return "early"
    elif total_minutes <= late_threshold:
        return "present"
    else:
        return "late"
    

def add_attendance(attendance:AttendanceCreate,db:Session):
    
    existing = (db.query(Attendance).filter(Attendance.studentId == attendance.studentId,   
            func.date(Attendance.date) == attendance.date.date()).first())
    
    if existing:
        return None
    
    status = get_status(attendance.date)

    last_record = db.query(Attendance).filter(
        Attendance.studentId == attendance.studentId
    ).order_by(Attendance.date.desc()).first()

    current_warning = last_record.warning if last_record else 0

    db_attendance = Attendance(
       roomNo=attendance.roomNo,
       name=attendance.name or db.query(StudentAdded).filter(StudentAdded.email == attendance.email).first().name,
       email=attendance.email,
       location=attendance.location or "Not Provided",
       image=attendance.image or "Not Available",
       date=attendance.date,
       studentId=attendance.studentId,
       status=status,
       warning=current_warning,
    )

    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)

    if status == "late":
        db_attendance.warning += 1
        db.commit()
        db.refresh(db_attendance)

    return {
        "id":db_attendance.id,
        "warning":db_attendance.warning,
        "attend_details":db_attendance
    }



def edit_attendance(id:int,db:Session):
    db.query(Attendance).filter(Attendance.studentId == id).update({Attendance.warning:0},synchronize_session=False)
    db.commit()

    return True



def get_attendance(email:str | None,db:Session):
    Attendances = db.query(Attendance).all()
    if not Attendances:
        return None
    
    if email:
        return db.query(Attendance).filter(Attendance.email == email).all()
    
    return Attendances


