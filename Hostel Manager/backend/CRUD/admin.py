from uuid import uuid4
from fastapi import HTTPException
from sqlalchemy.orm import Session
from allModels import AdminCreate,AdminLogin
from allSchemas import AdminNew,AdminLog


def create_Admin(db:Session,admin:AdminNew):

    existing_admin = db.query(AdminCreate).filter(AdminCreate.email == admin.email).first()
    if existing_admin:
        return None

    db_admin = AdminCreate(id=str(uuid4()),email=admin.email,password=admin.password,
                           role=admin.role or "admin")
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return {"message": f"Created successful","Created":db_admin}




def login_Admin(db:Session,admin:AdminLog):

    user = db.query(AdminCreate).filter(AdminCreate.email == admin.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="Admin Not Found")

    if user.password == admin.password:
        db_adminLog = AdminLogin(id=str(uuid4()),admin_id = user.id,email=admin.email)
        db.add(db_adminLog)
        db.commit()
        db.refresh(db_adminLog)
        return {"message": f"Login successful","Login": db_adminLog}
    else:
        raise HTTPException(status_code=404, detail="Invalid Credentials")



def By_google_create(db:Session,admin:AdminNew):
  
    existing=db.query(AdminCreate).filter(AdminCreate.email == admin.email).first()
    if existing:
        return None
  

    db_adminCre = AdminCreate(id=str(uuid4()),email=admin.email, name=admin.name)
    db.add(db_adminCre)
    db.commit()
    db.refresh(db_adminCre)
    return {"message": f"Account Created successful","Admin": db_adminCre}



def By_google_login(db:Session,admin:AdminLog):
  
    existing=db.query(AdminCreate).filter(AdminCreate.email == admin.email).first()
    if not existing:
        return None
  

    db_adminLog= AdminLogin(id=str(uuid4()),admin_id = existing.id,email=existing.email, name=existing.name)
    db.add(db_adminLog)
    db.commit()
    db.refresh(db_adminLog)
    return {"message": f"Login Successful","Login": db_adminLog}


def get_Admin(id,db:Session):
    return db.query(AdminCreate).filter(AdminCreate.id == id).first()

