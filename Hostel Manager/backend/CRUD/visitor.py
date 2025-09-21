from sqlalchemy.orm import Session
from allModels import VisitorLog,StudentAdded
from allSchemas import VisitorLogBase,VisitorLogUpdate

def add_visitor(visitor:VisitorLogBase,db:Session):

    db_visitor = VisitorLog(
        student_email =  visitor.student_email,
        student_name = db.query(StudentAdded).filter(StudentAdded.email == visitor.student_email).first().name,
        visitor_name = visitor.visitor_name,
        visitor_phone = visitor.visitor_phone,
        check_in = visitor.check_in
    )

    db.add(db_visitor)
    db.commit()
    db.refresh(db_visitor)

    return db_visitor



def edit_visitor(id:int,visitor:VisitorLogUpdate,db:Session):
    db_visitor = db.query(VisitorLog).filter(VisitorLog.id == id).first()
    if not db_visitor:
        return None
    
    db_visitor.check_out = visitor.check_out

    db.commit()
    db.refresh(db_visitor)

    return db_visitor


def get_visitors(db:Session):
    visitors = db.query(VisitorLog).all()

    if not visitors:
        return None
    
    return visitors
