from fastapi import HTTPException
from sqlalchemy.orm import Session
from allModels import StudentAdded,StudentCreate,StudentLogin,Attendance
from allSchemas import StudentNew,StudentLog


def create_Student(db:Session,student:StudentNew):

    authenStudent = db.query(StudentAdded).filter(StudentAdded.email == student.email).first()

    if authenStudent:

        existing_student = db.query(StudentCreate).filter(StudentCreate.email == student.email).first()
        if existing_student:
            return None

        db_student = StudentCreate(
            authen_id=authenStudent.id,
            email=student.email,
            password=student.password,
            name=authenStudent.name
        )
    
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
    
        return db_student
    
    else:
        raise HTTPException(status_code=404, detail="Student is not Hostelite")




def login_Student(db:Session,student:StudentLog):

    user = db.query(StudentCreate).filter(StudentCreate.email == student.email).first()

    if not user:
        return None

    if user.password == student.password:

        db_studentLog = StudentLogin(
            student_id = user.id,
            email=student.email
            )
        
        db.add(db_studentLog)
        db.commit()
        db.refresh(db_studentLog)

        authenStudent = db.query(StudentAdded).filter(StudentAdded.email == student.email).first()

        last_record = db.query(Attendance).filter(
        Attendance.studentId == authenStudent.id
        ).order_by(Attendance.date.desc()).first()

        return {
            "id":user.id,
            "student_details": user.student_details,
            "password":student.password,
            "warning":last_record.warning if last_record else 0
        }
    
    else:
        raise HTTPException(status_code=404, detail="Invalid Credentials")


def edit_Student(id:int,student:StudentNew,db:Session):
    user = db.query(StudentCreate).filter(StudentCreate.authen_id == id).first()

    if not user:
        return None
    
    user.password = student.password

    db.commit()
    db.refresh(user)

    return user

def By_google_create(db:Session,student:StudentNew):

    authenStudent = db.query(StudentAdded).filter(StudentAdded.email == student.email).first()

    if authenStudent:

        existing=db.query(StudentCreate).filter(StudentCreate.email == student.email).first()
        if existing:
            return None
  
        db_student = StudentCreate(
            authen_id=authenStudent.id,
            email=student.email,
            name=student.name
            )
        
        db.add(db_student)
        db.commit()
        db.refresh(db_student)

        return db_student
    
    else:
        raise HTTPException(status_code=404, detail="Student is not Hostelite")




  
    

def By_google_login(db:Session,student:StudentLog):
  
    existing=db.query(StudentCreate).filter(StudentCreate.email == student.email).first()
    if not existing:
        return None
  

    db_studentLog= StudentLogin(
        student_id = existing.id,
        email=existing.email,
        name=existing.name
        )
    
    db.add(db_studentLog)
    db.commit()
    db.refresh(db_studentLog)

    return {
            "id":db_studentLog.id,
            "student_details": existing.student_details
        }
    



def get_Student(id,db:Session):
    return db.query(StudentCreate).filter(StudentCreate.authen_id == id).first()
