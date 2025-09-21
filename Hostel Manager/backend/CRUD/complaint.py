from sqlalchemy.orm import Session
from allModels import Complaint,StudentCreate
from allSchemas import ComplaintCreate,ComplaintUpdate

def add_complaint(complaint:ComplaintCreate,db:Session):

    student = db.query(StudentCreate).filter(complaint.student_id == StudentCreate.authen_id).first()

    db_complaint = Complaint(
        title = complaint.title,
        description = complaint.description,
        category = complaint.category,
        priority = complaint.priority,
        student_name = student.student_details.name,
        room_no=student.student_details.room_assignment.roomNo
    )

    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)

    return db_complaint




def edit_complaint(id:int,complaint:ComplaintUpdate,db:Session):
    db_complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not db_complaint:
        return None
    
    db_complaint.status = complaint.status
    db_complaint.response = complaint.res or ("In progress" if complaint.status == 'in-progress' else 'Solved')
    db_complaint.resolvedBy = complaint.resolvedBy

    db.commit()
    db.refresh(db_complaint)

    return db_complaint


def get_complaints(name:str | None,db:Session):
    Complaints = db.query(Complaint).all()
    if not Complaints:
        return None
    
    if name:
        return db.query(Complaint).filter(Complaint.student_name == name).all()
    
    return Complaints
