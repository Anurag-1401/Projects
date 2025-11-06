from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date
from sqlalchemy.orm import Session
from db import SessionLocal
from allModels import Attendance, StudentCreate,LeaveApplication


import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def mark_absent_job():
    db: Session = SessionLocal()
    try:
        students = db.query(StudentCreate).all()
        for student in students:

            exists = db.query(Attendance).filter(
                Attendance.studentId == student.authen_id,
                Attendance.date == date.today()
            ).first()

            last_attendance = (
                db.query(Attendance)
                .filter(Attendance.studentId == student.authen_id)
                .order_by(Attendance.date.desc())
                .first()
            )

            student_on_leave = db.query(LeaveApplication).filter(
            LeaveApplication.student == student.name
            ).first()

            on_leave_today = False
            if student_on_leave:
                if student_on_leave.start_date <= date.today() <= student_on_leave.end_date:
                    on_leave_today = True

            prev_warning = last_attendance.warning if last_attendance else 0
            new_warning = prev_warning if on_leave_today else prev_warning + 1

            if not exists:

                room_no = student.student_details.room_assignment.roomNo if student.student_details and student.student_details.room_assignment else "Unknown"

                absent = Attendance(
                    studentId=student.authen_id,
                    name=student.name,
                    email=student.email,
                    roomNo=room_no,
                    date=date.today(), 
                    status="absent",
                    warning = new_warning
                    )
                db.add(absent)

        db.commit()
        print("Attendance auto-marked for missing students.")
    finally:
        db.close()

# def start_scheduler():
#     scheduler = BackgroundScheduler()
#     scheduler.add_job(mark_absent_job, "cron", hour=23, minute=59)
#     scheduler.start()
#     print("Scheduler started...")


def start_scheduler():
    # For production: run every day at 23:59
    # scheduler.add_job(mark_absent_job, "cron", hour=23, minute=59)

    # For testing: uncomment to run every 1 minute
    scheduler.add_job(mark_absent_job, "interval", minutes=2)

    scheduler.start()
    logger.info("Scheduler started.")
