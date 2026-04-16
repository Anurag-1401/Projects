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
    logger.info("🚀 Running auto attendance check...")

    db: Session = SessionLocal()
 
    try:
        connected_macs = get_connected_macs()
        logger.info(f"📡 Connected MACs: {connected_macs}")

        students = db.query(StudentAdded).all()
        logger.info(f"👥 Total Students: {len(students)}")

        for student in students:

            print(f"\n👤 Checking Student: {student.name}")
            print(f"   📌 Stored MAC: {student.mac_address}")

            if not student.mac_address:
                print("   ⚠ No MAC stored → Skipping")
                continue

            # Check if already marked
            exists = db.query(Attendance).filter(
                Attendance.studentId == student.id,
                func.date(Attendance.date) == date.today()
            ).first()

            if exists:
                print("   ⏭ Already marked today → Skipping")
                continue

            student_mac = student.mac_address.lower().replace("-", ":")

            print(f"   🔄 Normalized MAC: {student_mac}")

            # 🔥 MATCH CHECK
            if student_mac in connected_macs:
                print(f"   ✅ MATCH FOUND → {student.name}")

                now = datetime.now()

                attendance_data = AttendanceCreate(
                    studentId=student.id,
                    name=student.name,
                    email=student.email,
                    roomNo=student.room_assignment.roomNo if student.room_assignment else "Unknown",
                    location="Hostel WiFi",
                    image="MAC-Based",
                    date=now
                )

                add_attendance(attendance_data, db)

                print(f"   🎯 Attendance Marked for {student.name}")

            else:
                print("   ❌ No match found")

        db.commit()
        print("\n✅ Attendance cycle completed\n")

    except Exception as e:
        print("❌ Error in auto attendance:", e)

    finally:
        db.close()