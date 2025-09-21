from pydantic import BaseModel, Field
from typing import Optional,List
from datetime import datetime,date



class AdminNew(BaseModel):
    email: str
    password:Optional[str] = None
    role: Optional[str] = "admin"
    name : Optional[str] = ""


class AdminLog(BaseModel):
    email:str
    name : Optional[str] = ""
    password:Optional[str] = None

class AdminOut(AdminNew):
    id: str
    name: str
    email: str
    role:str
    

    class Config:
        orm_mode = True



class StudentBase(BaseModel):
    name : Optional[str] = ""
    email: Optional[str] = None

class Student(StudentBase):

    class Config:
        orm_mode = True




class RoomBase(BaseModel):
    roomNo: str
    capacity: int
    status:Optional[str] = ""
    occupied: Optional[int] = 0
    admin_email:Optional[str] = ""
    students: Optional[List] = []

class RoomCreate(RoomBase):
    pass

class RoomOut(RoomBase):
    id: int
    occupied:int

    class Config:
        orm_mode = True





class RoomAssignmentBase(BaseModel):
    roomNo: str
    


class RoomAssignmentCreate(RoomAssignmentBase):
    admin_email:str
    students: List = []

class RoomAssignmentOut(RoomAssignmentBase):
    id: int
    assignedBy: str
    students: List[Student] = []


    class Config:
        orm_mode = True




    

class StudentAdd(StudentBase):
    Guardian_Name:str
    Guardian_Phone:int
    reg_no:str
    phone: int
    department: str
    year: int
    DOB:date
    Addmission_Date:date
    admin_email:Optional[str] = None
    id:Optional[int] =None
    room_assignment:Optional[int] = None
    password:Optional[str] = None


class StudentUpdate(BaseModel):
    phone: int
    DOB:date
    Guardian_Name:str
    Guardian_Phone:int



class StudentNew(StudentBase):
    password:Optional[str] = None
    role: Optional[str] = "student"


class StudentLog(StudentBase):
    password:Optional[str] = None
   

class StudentOut(StudentAdd):
    id: int
    admin_email:Optional[str] = None
    feesDue : Optional[date] = None
    room_assignment:Optional[RoomAssignmentOut] = None

class StudentOutLogin(BaseModel):
    id:int
    student_details:Optional[StudentOut] = None
    password:str
    warning:Optional[int] = None

    class Config:
        orm_mode = True






class VisitorLogBase(BaseModel):
    visitor_name: str
    visitor_phone: str
    check_in: datetime
    student_email : str

class VisitorLogCreate(VisitorLogBase):
    pass

class VisitorLogUpdate(BaseModel):
    check_out: Optional[datetime] = None

class VisitorLogOut(VisitorLogBase):
    id: int
    student_name:str
    check_out:Optional[datetime] = None

    class Config:
        orm_mode = True




class AttendanceBase(BaseModel):
    studentId: int
    date: datetime
    name:str
    email:str
    location:str
    image:str
    roomNo:str
    status:Optional[str] = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceOut(AttendanceBase):
    id: int
    warning:int
    attend_details:Optional[AttendanceBase] = None

    class Config:
        orm_mode = True





class ComplaintBase(BaseModel):
    title: str
    description: str
    status: Optional[str] = None
    priority:str
    category:str


class ComplaintCreate(ComplaintBase):
    student_id: int

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    res:str
    resolvedBy:Optional[str] = None

class ComplaintOut(ComplaintBase):
    id: int
    student_name:str
    room_no:str
    response:str
    resolvedBy:Optional[str] = None
    createdAt:datetime
    updatedAt:datetime

    class Config:
        orm_mode = True



class LeaveApplicationBase(BaseModel):
    reason: str
    status: Optional[str] = None
    start_date: datetime
    end_date: datetime

class LeaveApplicationCreate(LeaveApplicationBase):
    studentId: int

class LeaveApplicationUpdate(BaseModel):
    status: Optional[str] = None
    approvedBy: Optional[str] = None
    response:str

class LeaveApplicationOut(LeaveApplicationBase):
    id: int
    approved_by: Optional[str]
    student:str
    roomNo:str
    response:str
    createdAt: datetime
    updatedAt:datetime

    class Config:
        orm_mode = True





class PaymentBase(BaseModel):
    studentId:int
    amount: float
    paymentId: str
    paymentType:str
    date: datetime
    remarks:Optional[str] = None
    
class PaymentUpdate(BaseModel):
    adminId:Optional[str] = None
    feesDue:Optional[date] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentOut(PaymentBase):
    id: int
    studentName:str
    roomNo:str
    adminId:Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        orm_mode = True


class Chat(BaseModel):
    email:str
    question:str
    isAdmin:Optional[bool] = None

class ChatOut(Chat):
    response:str

    class Config:
        orm_mode = True




