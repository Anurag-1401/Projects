from sqlalchemy.orm import Session
from allModels import LeaveApplication,StudentCreate
from allSchemas import LeaveApplicationCreate,LeaveApplicationUpdate

def add_leave(leave:LeaveApplicationCreate,db:Session):

    student = db.query(StudentCreate).filter(leave.studentId == StudentCreate.authen_id).first()

    db_leave = LeaveApplication(
        student = student.student_details.name,
        roomNo=student.student_details.room_assignment.roomNo,
        reason = leave.reason,
        start_date = leave.start_date,
        end_date = leave.end_date
        )

    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)

    return db_leave




def edit_leave(id:int,leave:LeaveApplicationUpdate,db:Session):
    db_leave = db.query(LeaveApplication).filter(LeaveApplication.id == id).first()
    if not db_leave:
        return None
    
    db_leave.status = leave.status
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
