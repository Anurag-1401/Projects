from sqlalchemy.orm import Session
from allSchemas import Chat
from allModels import StudentAdded, Payment, Complaint, LeaveApplication, VisitorLog

import re

def extract_student_from_text(q: str, db: Session):
    """
    Try to find a student in DB based on name or email mentioned in the question.
    """
    # Try to capture email pattern
    email_match = re.search(r"[\w\.-]+@[\w\.-]+", q)
    if email_match:
        student = db.query(StudentAdded).filter(StudentAdded.email == email_match.group()).first()
        if student:
            return student

    # Otherwise, search by name (case-insensitive partial match)
    words = q.split()
    for word in words:
        student = db.query(StudentAdded).filter(StudentAdded.name.ilike(f"%{word}%")).first()
        if student:
            return student

    return None


def fetch_from_db(chat: Chat, db: Session):
    q = chat.question.lower()

    # ✅ Step 1: Identify which student we are talking about
    if chat.isAdmin:
        student = extract_student_from_text(chat.question, db)
        if not student:
            return None  # Admin asked but student not found
    else:
        student = db.query(StudentAdded).filter(StudentAdded.email == chat.email).first()
        if not student:
            return "No student found with this email."

    db_info = []

    # ✅ Step 2: Check what info is being asked
    if any(word in q for word in ["name", "full name"]):
        db_info.append(f"Student Name: {student.name}")
    if any(word in q for word in ["email", "mail"]):
        db_info.append(f"Email: {student.email}")
    if any(word in q for word in ["phone", "contact"]):
        db_info.append(f"Phone: {student.phone}")
    if any(word in q for word in ["guardian", "parent"]):
        db_info.append(f"Guardian Name: {student.Guardian_Name}, Guardian Phone: {student.Guardian_Phone}")

    # Room info
    if any(word in q for word in ["room", "hostel", "hall"]):
        if student.room_assignment:
            db_info.append(f"Room Number: {student.room_assignment.roomNo}")
        else:
            db_info.append("No room assigned yet.")

    # Payments
    if any(word in q for word in ["fee", "due", "payment"]):
        payments = db.query(Payment).filter(Payment.studentId == student.id).all()
        if payments:
            payment_str = " | ".join([f"Amount: {p.amount}, Date: {p.date}, Status: Paid" for p in payments])
            db_info.append(payment_str)
        else:
            db_info.append("No payment records found.")

    # Complaints
    if "complaint" in q:
        complaints = db.query(Complaint).filter(Complaint.student_name.ilike(f"%{student.name}%")).all()
        if complaints:
            db_info.append(" | ".join([f"Complaint: {c.title}, Status: {c.status}, Response: {c.response}" for c in complaints]))
        else:
            db_info.append("No complaints found.")

    # Leaves
    if "leave" in q:
        leaves = db.query(LeaveApplication).filter(LeaveApplication.student.ilike(f"%{student.name}%")).all()
        if leaves:
            db_info.append(" | ".join([f"Reason: {l.reason}, From: {l.start_date}, To: {l.end_date}, Status: {l.status}" for l in leaves]))
        else:
            db_info.append("No leave records found.")

    # Visitors
    if "visitor" in q:
        visitors = db.query(VisitorLog).filter(VisitorLog.student_email == student.email).all()
        if visitors:
            db_info.append(" | ".join([f"Visitor: {v.visitor_name}, Phone: {v.visitor_phone}, Check-in: {v.check_in}" for v in visitors]))
        else:
            db_info.append("No visitor records found.")

    # ✅ Step 3: Return collected info
    if db_info:
        return " || ".join(db_info)
    else:
        return None
