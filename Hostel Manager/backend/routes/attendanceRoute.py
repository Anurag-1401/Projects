from fastapi import status,HTTPException,APIRouter,Depends
from sqlalchemy.orm import Session
from typing import Optional
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
import os,tempfile
from CRUD import attendance as as_crud
from db import get_db
from allSchemas import AttendanceCreate,AttendanceOut


router = APIRouter(
    prefix='/attendance',
    tags=['Attendance']
)



@router.post('/mark-attendance',status_code=status.HTTP_201_CREATED)
def add_attend(attendance:AttendanceCreate,db:Session=Depends(get_db)):
    Attendance = as_crud.add_attendance(attendance,db)

    if not Attendance:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT)
    
    return Attendance


@router.put('/action-attendance/{id}',status_code=status.HTTP_200_OK)
def edit_attend(id:int,db:Session=Depends(get_db)):
    Attendance = as_crud.edit_attendance(id,db)

    if not Attendance:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT)
    
    return Attendance



@router.get('/get-attendance',status_code=status.HTTP_200_OK,response_model=list[AttendanceOut])
def get_attend(email:Optional[str] = None,db:Session=Depends(get_db)):
    Attendance = as_crud.get_attendance(email,db)

    if not Attendance:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return Attendance


@router.get("/export-attendance", status_code=status.HTTP_200_OK)
def export_attendance(email:Optional[str] = None, db: Session = Depends(get_db)):
    attendances = as_crud.get_attendance(email, db)
    if not attendances:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    tmp_dir = tempfile.mkdtemp()
    file_path = os.path.join(tmp_dir, f"attendance-{email}.pdf")

    doc = SimpleDocTemplate(file_path, pagesize=letter)
    
    data = [
        ["ID", "Name", "Email", "Date", "Room No", "Location", "Status","Warning"]
    ]
    for att in attendances:
        data.append([
            str(att.id),
            att.name,
            att.email,
            att.date.strftime("%Y-%m-%d %H:%M"),
            att.roomNo,
            att.location,
            att.status,
            att.warning,
        ])

    table = Table(data, repeatRows=1) 
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 12),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
    ]))

    elements = [table]
    doc.build(elements)

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=f"attendance-{email}.pdf"
    )

