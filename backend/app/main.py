from fastapi import FastAPI, HTTPException

from app.db.database import check_database_connection


app = FastAPI(
    title="Property Showcase & Inquiry Manager",
    version="1.0.0",
)


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