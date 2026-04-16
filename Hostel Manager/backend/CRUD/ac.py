import io
from fastapi import HTTPException
from sqlalchemy.orm import Session
from allModels import AcademicCalendar

import re
from datetime import datetime, timedelta
import easyocr
import numpy as np
from PIL import Image


# ================= GOOGLE VISION ================= #

def extract_text_google(file_bytes):

    reader = easyocr.Reader(['en'])

    image = Image.open(io.BytesIO(file_bytes))
    image_np = np.array(image)

    result = reader.readtext(image_np)

    text = " ".join([res[1] for res in result])

    return text


# ================= CALENDAR LOGIC ================= #

def upload_ac(db: Session, file: bytes):

    try:

        db.query(AcademicCalendar).delete()
        db.commit()
        
        text = extract_text_google(file)

        holidays = extract_holidays(text)

        if not holidays:
            raise HTTPException(status_code=400, detail="No dates found")

        # 🔥 get range
        dates = [h["date"] for h in holidays]
        min_date = min(dates)
        max_date = max(dates)

        current = min_date
        inserted = 0

        while current <= max_date:

            existing = db.query(AcademicCalendar).filter(
                AcademicCalendar.date == current
            ).first()

            if existing:
                current += timedelta(days=1)
                continue

            # 🔥 check if holiday from OCR
            holiday_match = next((h for h in holidays if h["date"] == current), None)

            if holiday_match:
                is_working = False
                reason = holiday_match["reason"]

            elif current.weekday() in [5, 6]:  # Saturday/Sunday
                is_working = False
                reason = "Weekend"

            else:
                is_working = True
                reason = "Working Day"

            db.add(AcademicCalendar(
                date=current,
                is_working_day=is_working,
                reason=reason,
                day=current.strftime("%A")
            ))

            inserted += 1
            current += timedelta(days=1)

        db.commit()

        return {
            "message": "Full calendar created",
            "total_days": inserted
        }

    except Exception as e:
        db.rollback()
        print("🔥 ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
    

def extract_holidays(text):

    holidays = []

    pattern = r'\d{1,2}[./-]\d{1,2}[./-]\d{4}'
    matches = list(re.finditer(pattern, text))

    for i in range(len(matches)):

        try:
            date_str = matches[i].group()

            start = matches[i].end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)

            reason_text = text[start:end].strip()

            clean_date = date_str.replace('/', '.').replace('-', '.')
            date_obj = datetime.strptime(clean_date, "%d.%m.%Y").date()

            reason_text = re.sub(r'\s+', ' ', reason_text)
            reason_text = re.sub(
                r'(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)',
                '',
                reason_text,
                flags=re.IGNORECASE
            )

            reason = " ".join(reason_text.split()[:4])

            holidays.append({
                "date": date_obj,
                "reason": reason or "Holiday"
            })

        except:
            continue

    return holidays


def add_weekends(db: Session):

    dates = db.query(AcademicCalendar.date).all()
    if not dates:
        return

    min_date = min(d[0] for d in dates)
    max_date = max(d[0] for d in dates)

    current = min_date

    while current <= max_date:

        if current.weekday() in [5, 6]:
            exists = db.query(AcademicCalendar).filter(
                AcademicCalendar.date == current
            ).first()

            if not exists:
                db.add(AcademicCalendar(
                    date=current,
                    is_working_day=False,
                    reason="Weekend",
                    day=current.strftime("%A")
                ))

        current += timedelta(days=1)

    db.commit()


def add_working_days(db: Session):

    dates = db.query(AcademicCalendar.date).all()
    if not dates:
        return

    min_date = min(d[0] for d in dates)
    max_date = max(d[0] for d in dates)

    current = min_date

    while current <= max_date:

        exists = db.query(AcademicCalendar).filter(
            AcademicCalendar.date == current
        ).first()

        if not exists:
            db.add(AcademicCalendar(
                date=current,
                is_working_day=True,
                reason="Working Day",
                day=current.strftime("%A")
            ))

        current += timedelta(days=1)

    db.commit()