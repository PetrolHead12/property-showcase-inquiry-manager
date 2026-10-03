from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.core.db import check_database_connection
from app.api.routes.properties import router as properties_router
from app.api.routes.inquiries import router as inquiries_router

app = FastAPI(
    title="Property Showcase & Inquiry Manager",
    version="1.0.0",
)

# Allow the local frontend dev servers to call the API during development.
# Tighten this to your actual deployed frontend origins before shipping.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(properties_router, prefix="/api")
app.include_router(inquiries_router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/health/db")
async def database_health_check():
    try:
        is_connected = await check_database_connection()

        if is_connected:
            return {
                "status": "ok",
                "database": "connected",
            }

        raise HTTPException(
            status_code=503,
            detail="Database connection failed",
        )

    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Database connection failed: {exc}",
        )