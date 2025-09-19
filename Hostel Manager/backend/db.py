# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DB_URL = 'sqlite:///./storage.db'

# engine = create_engine(SQLALCHEMY_DB_URL,connect_args={"check_same_thread":False})

# SessionLocal = sessionmaker(autocommit=False,autoflush=False, bind=engine)

# Base = declarative_base()


# def get_db():
#     db = SessionLocal()

#     try:
#         yield db
#     finally:
#         db.close()




from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
# import sqlitecloud

# # Your SQLite Cloud connection string
# SQLITE_CLOUD_URL = "sqlitecloud://cm7belajhk.g5.sqlite.cloud:8860/auth.sqlitecloud?apikey=dma7H6ywCzn7U5bjHwaVbMibC1cwH11Pw8KWOf1kNCk"

# def get_sqlitecloud_connection():
#     return sqlitecloud.connect(SQLITE_CLOUD_URL)

# # Use creator so SQLAlchemy uses sqlitecloud connection
# engine = create_engine(
#     "sqlite://",  # dummy, but required by SQLAlchemy
#     creator=get_sqlitecloud_connection
# )

import os

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True) 

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
