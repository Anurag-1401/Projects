import json
from fastapi import HTTPException
from sqlalchemy.orm import Session
from allModels import Room,RoomAssignment,StudentAdded
from allSchemas import RoomCreate,RoomAssignmentCreate


def Add_Room(room:RoomCreate,db:Session):
    existing = db.query(Room).filter(Room.roomNo == room.roomNo).first()
    if existing:
        return None
    
    db_room = Room(
        roomNo = room.roomNo,
        capacity = room.capacity,
        occupied = 0,
        status = 'available' if room.capacity > 0 else 'full' 
    )

    db.add(db_room)
    db.commit()
    db.refresh(db_room)

    return db_room


def Edit_Room(id: int, room: RoomCreate, db: Session):
    existing = db.query(Room).filter(Room.id == id).first()
    if not existing:
        return None

    existing.roomNo = room.roomNo
    existing.capacity = room.capacity

    valid_students = [s for s in room.students if s is not None]

    assign = db.query(RoomAssignment).filter(
        RoomAssignment.roomNo == existing.roomNo
    ).first()

    if not assign:
        assign = RoomAssignment(
            roomNo=existing.roomNo,
            assignedBy=room.admin_email,
            allocatedTo="[]",
            available=existing.capacity
        )
        db.add(assign)
        db.commit()
        db.refresh(assign)

    old_students = db.query(StudentAdded).filter(
        StudentAdded.room_assignment_id == assign.id
    ).all()

    old_emails = {s.email for s in old_students}
    new_emails = {s["email"] for s in valid_students}

    for student in old_students:
        if student.email not in new_emails:
            student.room_assignment_id = None

    for student_dict in valid_students:
        student_obj = db.query(StudentAdded).filter(
            StudentAdded.email == student_dict["email"]
        ).first()

        if student_obj:
            student_obj.room_assignment_id = assign.id

    existing.occupied = len(valid_students)

    if existing.occupied >= existing.capacity:
        existing.status = "full"
    else:
        existing.status = "available"

    assign.allocatedTo = json.dumps([s["name"] for s in valid_students])
    assign.available = existing.capacity - len(valid_students)

    db.commit()
    db.refresh(existing)

    return existing



def Del_Room(id: int, db: Session):
    existing = db.query(Room).filter(Room.id == id).first()
    if not existing:
        return None

    assignment = db.query(RoomAssignment).filter(
        RoomAssignment.roomNo == existing.roomNo
    ).first()

    if assignment:
        # 🔥 Step 1: remove student links
        students = db.query(StudentAdded).filter(
            StudentAdded.room_assignment_id == assignment.id
        ).all()

        for student in students:
            student.room_assignment_id = None

        db.flush()  # 🔥 VERY IMPORTANT

        # 🔥 Step 2: delete assignment
        db.delete(assignment)
        db.flush()  # 🔥 FORCE EXECUTION

    # 🔥 Step 3: delete room
    db.delete(existing)

    db.commit()

    return {"message": "Room deleted successfully"}


def Get_Room(db:Session):
    Rooms = db.query(Room).all()
    if not Rooms:
        return None
    
    return Rooms




def Assign_Room(roomAssign:RoomAssignmentCreate,db:Session):
    existing = db.query(RoomAssignment).filter(RoomAssignment.roomNo == roomAssign.roomNo).first()
    if existing:
        return None
    
    room = db.query(Room).filter(Room.roomNo == roomAssign.roomNo).first()

    valid_students = [s for s in roomAssign.students if s is not None]

    db_assign = RoomAssignment(
        roomNo = roomAssign.roomNo,
        assignedBy = roomAssign.admin_email,
        available = room.capacity - len(valid_students),
        allocatedTo = json.dumps(valid_students)

    )

    room.occupied = len(valid_students)

    if room.occupied == room.capacity:
        room.status = "full"
    else:
        room.status = "available"
    

    db.add(db_assign)
    db.commit()
    db.refresh(db_assign)
    db.refresh(room)


    for student_name in roomAssign.students:
        student = db.query(StudentAdded).filter(StudentAdded.name == student_name).first()
        if student:
            student.room_assignment_id = RoomAssignment.id
        
    db.commit()

    return db_assign





def Get_Room_Assigned(db:Session):
    Rooms = db.query(RoomAssignment).all()
    if not Rooms:
        return None
    
    return Rooms