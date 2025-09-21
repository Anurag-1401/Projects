from fastapi import status,HTTPException,APIRouter,Depends
from sqlalchemy.orm import Session
from typing import Optional
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
import os,tempfile
from CRUD import payments as py_crud
from db import get_db
from allSchemas import PaymentBase,PaymentOut,PaymentUpdate


router = APIRouter(
    prefix='/payment',
    tags=['Payment']
)



@router.post('/add-payment',status_code=status.HTTP_201_CREATED)
def add_payment(payment:PaymentBase,db:Session=Depends(get_db)):
    Payment = py_crud.add_payment(payment,db)

    if not Payment:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT)
    
    return Payment


@router.put('/edit-payment/{id}',status_code=status.HTTP_200_OK)
def edit_payment(id:int,payment:PaymentUpdate,db:Session=Depends(get_db)):
    Payment = py_crud.edit_payment(id,payment,db)

    if not Payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return Payment


@router.put('/set-dueDate',status_code=status.HTTP_200_OK)
def set_duedate(payment:PaymentUpdate,db:Session=Depends(get_db)):
    Payment = py_crud.set_due(payment,db)

    if not Payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return Payment



@router.get('/get-payment',status_code=status.HTTP_200_OK,response_model=list[PaymentOut])
def get_payment(id:Optional[int] = None, db:Session=Depends(get_db)):
    Payment = py_crud.get_payments(id,db)

    if not Payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return Payment


@router.get("/export-payment", status_code=status.HTTP_200_OK)
def export_payment(id:Optional[int] = None, db: Session = Depends(get_db)):
    Payment = py_crud.get_payments(id, db)
    if not Payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    tmp_dir = tempfile.mkdtemp()
    file_path = os.path.join(tmp_dir, f"payment-{id}.pdf")

    doc = SimpleDocTemplate(file_path, pagesize=letter)
    
    data = [
        ["ID", "Name", "Date", "Room No", "Amount" , "Payment ID","Payment Type"]
    ]
    for att in Payment:
        data.append([
            str(att.id),
            att.studentName,
            att.date.strftime("%Y-%m-%d %H:%M"),
            att.roomNo,
            att.amount,
            att.paymentId,
            att.paymentType,
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
        media_type="payment/pdf",
        filename=f"payment-{id}.pdf"
    )