from sqlalchemy.orm import Session
from allModels import AcademicCalendar, LeaveApplication,StudentCreate
from allSchemas import LeaveApplicationCreate,LeaveApplicationUpdate
from datetime import timedelta

def add_leave(leave:LeaveApplicationCreate,db:Session):

    student = db.query(StudentCreate).filter(StudentCreate.authen_id == leave.studentId).first()

    if not student:
        return None
    
    working = has_working_days(db, leave.start_date, leave.end_date)
    
    level = "coordinator" if working else "warden"

    db_leave = LeaveApplication(
        student = student.student_details.name,
        roomNo=student.student_details.room_assignment.roomNo,
        reason = leave.reason,
        start_date = leave.start_date,
        end_date = leave.end_date,
        current_level = level
        )

    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)

    return db_leave


def edit_leave(id:int,leave:LeaveApplicationUpdate,db:Session):
    db_leave = db.query(LeaveApplication).filter(LeaveApplication.id == id).first()
    if not db_leave:
        return None
    
    if db_leave.current_level == "coordinator":

        if leave.status == "rejected":
            db_leave.status = "rejected"
            db_leave.coordinator_status = "rejected"
            db_leave.approved_by = leave.approvedBy
            db_leave.response = leave.response

        elif leave.status == "approved":
            db_leave.coordinator_status = "approved"
            db_leave.current_level = "warden"
            db_leave.response = leave.response

    elif db_leave.current_level == "warden":

        if leave.status == "rejected":
            db_leave.status = "rejected"
            db_leave.warden_status = "rejected"

        elif leave.status == "approved":
            db_leave.status = "approved"
            db_leave.warden_status = "approved"

        db_leave.approved_by = leave.approvedBy
        db_leave.response = leave.response

    db.commit()
    db.refresh(db_leave)

    return db_leave


def get_leaves(name:str | None,db:Session):
    leaves = db.query(LeaveApplication).all()
    if not leaves:
        return None
    
    if name:
        return db.query(LeaveApplication).filter(LeaveApplication.student == name).all()
    
    return leaves


def has_working_days(db, start_date, end_date):
    current = start_date

    while current <= end_date:
        day = db.query(AcademicCalendar).filter(
            AcademicCalendar.date == current.date()
        ).first()

        if not day or day.is_working_day:
            return True

        current += timedelta(days=1)

    return False