from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db import engine
import allModels
from CRUD import attendanceJob
from ROUTER import routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    attendanceJob.start_scheduler()
    print("App started, scheduler running...")
    yield
    print("App shutting down... you can stop scheduler here if needed")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

allModels.Base.metadata.create_all(bind=engine)

app.include_router(routes.router)

@app.get('/')
def index():
    return {"Welcome to SGGS Hostel Manager System"}

