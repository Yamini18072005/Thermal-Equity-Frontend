import os

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from database.db import init_db
from routes.api import router

frontend_origins = [origin.strip() for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",") if origin.strip()]

app = FastAPI(title="Thermal Equity AI API", version="1.0.0", description="Urban thermal equity data and risk assessment API.")
app.add_middleware(CORSMiddleware, allow_origins=frontend_origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(router)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exception: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": "Invalid request data", "errors": exception.errors()})


@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(_: Request, __: SQLAlchemyError):
    return JSONResponse(status_code=503, content={"detail": "Database operation failed"})


@app.get("/", tags=["Health"], description="Legacy root endpoint retained for compatibility.")
def home():
    return {"message": "Backend is working!"}   