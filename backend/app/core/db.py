"""
Place at: backend/app/core/db.py (replace existing)

NOTE: alembic/env.py also needs a one-line change — see below.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Settings(BaseSettings):
    database_url: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @property
    def async_database_url(self) -> str:
        """
        Normalize the configured URL to always use the asyncpg driver.

        Hosting providers (Railway, Render, Heroku-style add-ons, etc.)
        commonly hand out a plain `postgresql://...` or `postgres://...`
        connection string, which SQLAlchemy's async engine cannot use
        directly — it defaults to the sync `psycopg` dialect for that
        scheme. Rather than relying on every environment's operator to
        remember to append `+asyncpg` by hand, we normalize it here so
        the same DATABASE_URL works locally and on any host.
        """
        url = self.database_url
        if url.startswith("postgresql+asyncpg://"):
            return url
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+asyncpg://", 1)
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql+asyncpg://", 1)
        return url


settings = Settings()

engine = create_async_engine(
    settings.async_database_url,
    echo=True,
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def check_database_connection() -> bool:
    async with engine.connect() as connection:
        result = await connection.execute(text("SELECT 1"))
        return result.scalar() == 1