"""
Shared FastAPI dependencies.

"""
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import async_session_maker


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield a DB session per-request, closing it afterwards.

    FastAPI will call this as a dependency; the session is rolled back on
    unhandled exceptions by virtue of the context manager exiting without
    commit (routes are responsible for explicit commit()).
    """
    async with async_session_maker() as session:
        yield session