from sqlalchemy.orm import Session
from datetime import datetime, date
from db import SessionLocal
from allModels import StudentAdded, Attendance
# from services.ruckus_client import get_connected_macs_from_ruckus
from services.mac_scanner import get_connected_macs
from CRUD.attendance import add_attendance
from allSchemas import AttendanceCreate
from sqlalchemy import func
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def run_auto_attendance():
    logger.info("Running auto attendance check...")

    db: Session = SessionLocal()

    try:
        connected_macs = get_connected_macs()
        students = db.query(StudentAdded).all()

        for student in students:

            if not student.mac_address:
                continue

            exists = db.query(Attendance).filter(
                Attendance.studentId == student.id,
                func.date(Attendance.date) == date.today()
            ).first()

            if exists:
                continue

            # 🔥 MATCH MAC
            if student.mac_address.lower() in connected_macs:

                now = datetime.now()

                # 🔥 USE EXISTING SCHEMA
                attendance_data = AttendanceCreate(
                    studentId=student.id,
                    name=student.name,
                    email=student.email,
                    roomNo=student.room_assignment.roomNo if student.room_assignment else "Unknown",
                    location="Hostel WiFi",
                    image="MAC-Based",
                    date=now
                )

                # 🔥 USE EXISTING LOGIC
                add_attendance(attendance_data, db)

        db.commit()

    except Exception as e:
        print("Error in auto attendance:", e)

    finally:
        db.close()