from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import engine, Base
import allModels
from CRUD import attendanceJob
from ROUTER import routes

app = FastAPI()

allModels.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "https://sggshostel.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.api_route("/health", methods=["GET", "POST", "HEAD"])
async def health_check(request: Request):
    return {"status": "ok", "method": request.method}
    

@app.on_event("startup")
async def startup_event():
    attendanceJob.start_scheduler()
    

@app.get('/')
def index():
    return {"message": "Welcome to SGGS Hostel Manager System"}
