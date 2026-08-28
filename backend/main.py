import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path

# Ensure project root and backend directory are in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

try:
    from database.db import init_db
except ImportError:
    from db import init_db

try:
    from backend.routes.api import router
except ImportError:
    from routes.api import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


frontend_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:3000,"
        "http://localhost:5173,"
        "http://localhost:5174,"
        "http://127.0.0.1:3000,"
        "http://127.0.0.1:5173,"
        "http://127.0.0.1:5174",
    ).split(",")
    if origin.strip()
]


app = FastAPI(
    title="Thermal Equity AI API",
    version="1.0.0",
    description="Urban thermal equity data and risk assessment API.",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|.*\.netlify\.app|.*\.railway\.app)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exception: RequestValidationError,
):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Invalid request data",
            "errors": exception.errors(),
        },
    )


@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(
    request: Request,
    exception: SQLAlchemyError,
):
    return JSONResponse(
        status_code=503,
        content={
            "detail": "Database operation failed",
        },
    )


@app.get("/", tags=["Health"])
def home():
    return {
        "message": "Thermal Equity AI backend is working!"
    }


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "ok",
        "service": "Thermal Equity AI API",
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0" if os.getenv("PORT") else "127.0.0.1")

    uvicorn.run(
        "backend.main:app",
        host=host,
        port=port,
        reload=True,
    )