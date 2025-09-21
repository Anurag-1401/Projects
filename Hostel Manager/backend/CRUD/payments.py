from sqlalchemy.orm import Session
from sqlalchemy import func
from allModels import Payment,StudentCreate,StudentAdded
from allSchemas import PaymentBase,PaymentUpdate

def add_payment(payment:PaymentBase,db:Session):

    student = db.query(StudentCreate).filter(payment.studentId == StudentCreate.authen_id).first()

    db_payment = Payment(
        studentId = payment.studentId,
        studentName = student.name or student.email,
        amount = payment.amount,
        paymentId=payment.paymentId,
        paymentType = payment.paymentType,
        date = payment.date,
        remarks = payment.remarks or 'Paid',
        roomNo=student.student_details.room_assignment.roomNo
    )

    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    return db_payment




def edit_payment(id:int,payment:PaymentUpdate,db:Session):
    db_payment = db.query(Payment).filter(Payment.id == id).first()
    if not db_payment:
        return None
    
    db_payment.adminId = payment.adminId

    db.commit()
    db.refresh(db_payment)

    return db_payment


def set_due(payment: PaymentUpdate, db: Session):
    db_updated = db.query(StudentAdded).filter(
        StudentAdded.id.in_(
            db.query(StudentAdded.id)
            .outerjoin(Payment, StudentAdded.id == Payment.studentId)
            .group_by(StudentAdded.id)
            .having(func.count(Payment.id) < 2)
        )
    ).update({StudentAdded.feesDue: payment.feesDue}, synchronize_session=False)

    db.commit()
    return db_updated
    


def get_payments(id:int | None,db:Session):
    Payments = db.query(Payment).all()
    if not Payments:
        return None
    
    if id:
        return db.query(Payment).filter(Payment.studentId == id).all()
    
    return Payments
