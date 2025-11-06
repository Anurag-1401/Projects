from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import date
from sqlalchemy.orm import Session
from db import SessionLocal
from allModels import Attendance, StudentCreate, LeaveApplication
import logging

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = BackgroundScheduler()

def mark_absent_job():
    """Mark students as absent if not marked present or on leave."""
    db: Session = SessionLocal()
    try:
        students = db.query(StudentCreate).all()  # ✅ Use ORM model, not Pydantic schema

        for student in students:
            # Check if attendance for today already exists
            exists = (
                db.query(Attendance)
                .filter(Attendance.studentId == student.authen_id, Attendance.date == date.today())
                .first()
            )

            # Last attendance record
            last_attendance = (
                db.query(Attendance)
                .filter(Attendance.studentId == student.authen_id)
                .order_by(Attendance.date.desc())
                .first()
            )

            # Check leave status
            student_on_leave = db.query(LeaveApplication).filter(
                LeaveApplication.student == student.name
            ).first()

            on_leave_today = False
            if student_on_leave and student_on_leave.start_date <= date.today() <= student_on_leave.end_date:
                on_leave_today = True

            prev_warning = last_attendance.warning if last_attendance else 0
            new_warning = prev_warning if on_leave_today else prev_warning + 1

            # If no attendance marked for today, create absent record
            if not exists and not on_leave_today:
                room_no = (
                    student.student_details.room_assignment.roomNo
                    if student.student_details and student.student_details.room_assignment
                    else "Unknown"
                )

                absent = Attendance(
                    studentId=student.authen_id,
                    name=student.student_details.name if student.student_details else "Unknown",
                    email=student.email,
                    location="Not Provided",
                    image="Not Available",
                    roomNo=room_no,
                    date=date.today(),
                    status="absent",
                    warning=new_warning,
                )

                db.add(absent)

        db.commit()
        logger.info("✅ Attendance auto-marked for missing students.")
    except Exception as e:
        logger.error(f"❌ Error in attendance job: {e}")
    finally:
        db.close()


def start_scheduler():
    """Start APScheduler safely (Render-safe)."""
    if not scheduler.running:
        # Run every day at 23:59
        # scheduler.add_job(mark_absent_job, CronTrigger(hour=23, minute=59))

        # ⏱ For testing only (every 2 mins) — comment out for production
        scheduler.add_job(mark_absent_job, "interval", minutes=2)

        scheduler.start()
        logger.info("🕒 Scheduler started successfully.")
    else:
        logger.info("⏩ Scheduler already running — skipped reinitialization.")
