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

    # 🔥 Greeting handling
    if any(greet in q for greet in ["hi", "hello", "hey"]):
        return "Hello! 👋 How can I help you?"

    response = []

    # =========================================================
    # 👨‍💼 ADMIN LOGIC
    # =========================================================
    if chat.isAdmin:
        # 🔹 CASE 1: Admin asking about himself
        if any(word in q for word in ["my", "me", "mine"]):
            if "email" in q:
                response.append(f"Email: {chat.email}")
            if "name" in q:
                response.append("Name: Admin")
            if "phone" in q:
                response.append("Phone: Not available")

            return "\n".join(response) if response else "⚠️ No personal data available."

        # 🔹 CASE 2: Admin asking about student
        student = extract_student_from_text(chat.question, db)

        if not student:
            return (
                "⚠️ Please mention student name or email.\n\n"
                "Examples:\n"
                "- What is Rahul's room?\n"
                "- Show payment of amit@xyz.com\n"
            )

    # =========================================================
    # 🎓 STUDENT LOGIC
    # =========================================================
    else:
        # 🔹 CASE 1: Student asking about himself
        if any(word in q for word in ["my", "me", "mine"]):
            student = db.query(StudentAdded).filter(
                StudentAdded.email == chat.email
            ).first()

            if not student:
                return "⚠️ Student record not found."

        # 🔹 CASE 2: Student asking about admin (LIMITED ACCESS)
        elif any(word in q for word in ["admin", "warden", "rector"]):
            return (
                "👨‍💼 Admin Contact:\n"
                "Email: admin@hostel.com\n"
                "Phone: +91-XXXXXXXXXX"
            )

        # 🔹 CASE 3: Student trying to access other students ❌
        else:
            return "⚠️ You can only access your own details."

    # =========================================================
    # 🔍 COMMON DATA FETCH (FOR VALID STUDENT)
    # =========================================================

    if any(k in q for k in ["name", "who am i"]):
        response.append(f"Name: {student.name}")

    if any(k in q for k in ["email"]):
        response.append(f"Email: {student.email}")

    if any(k in q for k in ["phone", "contact"]):
        response.append(f"Phone: {student.phone}")

    if any(k in q for k in ["guardian", "parent"]):
        response.append(
            f"Guardian: {student.Guardian_Name} ({student.Guardian_Phone})"
        )

    # 🏠 ROOM
    if any(k in q for k in ["room", "hostel"]):
        if student.room_assignment:
            response.append(f"Room No: {student.room_assignment.roomNo}")
        else:
            response.append("Room not assigned")

    # 💰 PAYMENTS
    if any(k in q for k in ["payment", "fee", "due"]):
        payments = db.query(Payment).filter(
            Payment.studentId == student.id
        ).all()

        if payments:
            for p in payments:
                response.append(f"₹{p.amount} | {p.date} | Paid")
        else:
            response.append("No payment records")

    # 📝 COMPLAINTS
    if "complaint" in q:
        complaints = db.query(Complaint).filter(
            Complaint.student_name.ilike(f"%{student.name}%")
        ).all()

        if complaints:
            for c in complaints:
                response.append(f"{c.title} → {c.status}")
        else:
            response.append("No complaints found")

    # 🌴 LEAVE
    if "leave" in q:
        leaves = db.query(LeaveApplication).filter(
            LeaveApplication.student.ilike(f"%{student.name}%")
        ).all()

        if leaves:
            for l in leaves:
                response.append(
                    f"{l.reason} ({l.start_date} to {l.end_date}) → {l.status}"
                )
        else:
            response.append("No leave records")

    # 👥 VISITOR
    if "visitor" in q:
        visitors = db.query(VisitorLog).filter(
            VisitorLog.student_email == student.email
        ).all()

        if visitors:
            for v in visitors:
                response.append(f"{v.visitor_name} ({v.check_in})")
        else:
            response.append("No visitors found")

    return "\n".join(response) if response else "⚠️ No relevant data found."