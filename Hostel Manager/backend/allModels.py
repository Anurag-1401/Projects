from sqlalchemy import Column,Integer,String,ForeignKey,DateTime,Date,Float,Boolean,ARRAY,Table
from datetime import datetime,timezone
from db import Base
from sqlalchemy.orm import relationship



class AdminCreate(Base):

    __tablename__ = "AdminCreate"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String)
    role = Column(String, default="admin")
    password = Column(String)
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))


class AdminLogin(Base):

    __tablename__ = "AdminLogin"

    id = Column(String,primary_key=True)
    name = Column(String)
    admin_id = Column(String, ForeignKey("AdminCreate.id"), nullable=False)
    email = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))



class StudentAdded(Base):
    __tablename__ = "StudentAdded"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(String, ForeignKey("AdminCreate.id"), nullable=False)
    name = Column(String)
    Guardian_Name = Column(String)
    Guardian_Phone = Column(Integer)
    reg_no = Column(String,unique=True)
    email = Column(String, unique=True, index=True)
    phone = Column(Integer)
    department = Column(String)
    year = Column(Integer)
    DOB = Column(Date)
    Addmission_Date = Column(Date)
    feesDue = Column(Date)
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    room_assignment_id = Column(Integer, ForeignKey("room_assignments.id"))

    room_assignment = relationship("RoomAssignment", back_populates="students",passive_deletes=True)

    student_access = relationship("StudentCreate", back_populates="student_details",passive_deletes=True)




class StudentCreate(Base):
    __tablename__ = "StudentCreate"

    id = Column(Integer, primary_key=True, index=True)
    authen_id = Column(Integer,ForeignKey("StudentAdded.id"))
    name = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="student")
    password = Column(String)
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    student_details = relationship("StudentAdded", back_populates="student_access",passive_deletes=True)





class StudentLogin(Base):
    __tablename__ = "StudentLogin"

    id = Column(Integer, primary_key=True, index=True)
    student_id =Column(Integer,ForeignKey("StudentCreate.id"),nullable=False)
    name = Column(String)
    email = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))






class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True)
    roomNo = Column(String, unique=True, nullable=False)
    capacity = Column(Integer, nullable=False)
    occupied = Column(Integer,default=0)
    status = Column(String)
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))



class RoomAssignment(Base):
    __tablename__ = "room_assignments"

    id = Column(Integer, primary_key=True)
    roomNo = Column(String,ForeignKey("rooms.roomNo"))
    assignedBy = Column(String, ForeignKey("AdminCreate.email"))
    assignedDate = Column(DateTime, default=datetime.now(timezone.utc))
    available = Column(Integer)
    allocatedTo = Column(String)

    students = relationship("StudentAdded", back_populates="room_assignment",passive_deletes=True)




class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True)
    studentId = Column(String, ForeignKey("StudentAdded.id"), nullable=False)
    name=Column(String)
    email=Column(String)
    location=Column(String)
    image=Column(String)
    roomNo = Column(String)
    date = Column(DateTime, nullable=False)
    status = Column(String)
    warning = Column(Integer)



class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    adminId = Column(String,ForeignKey("AdminCreate.email"))
    studentId = Column(Integer,ForeignKey("StudentAdded.id"))
    studentName = Column(String)
    roomNo = Column(String)
    amount = Column(Float, nullable=False)
    paymentId = Column(String)
    paymentType = Column(String)
    date = Column(DateTime)
    remarks = Column(String)
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))



class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True)
    student_name = Column(String)
    room_no = Column(String)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    priority=Column(String)
    status = Column(String,default="pending")
    resolvedBy = Column(String)
    response = Column(String,default='Not yet responded')
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))





class LeaveApplication(Base):
    __tablename__ = "leave_applications"

    id = Column(Integer, primary_key=True, index=True)
    student = Column(String)
    roomNo = Column(String)
    reason = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String, default="pending")
    response = Column(String,default='Not yet responded')
    approved_by = Column(String, default="Not yet approved")
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))




class VisitorLog(Base):
    __tablename__ = "visitor_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_email =  Column(String, ForeignKey("StudentCreate.email"))
    student_name = Column(String)
    visitor_name = Column(String)
    visitor_phone = Column(String)
    check_in = Column(DateTime)
    check_out = Column(DateTime, nullable=True)
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))


class Assistant(Base):

    __tablename__ = "assistant"

    id = Column(Integer,primary_key=True,index=True)
    student = Column(String,ForeignKey('StudentCreate.email'))
    question = Column(String)
    response = Column(String)
    createdAt = Column(DateTime, default=datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

