"""
VYTAL Core Configuration Module
Reads from environment variables and provides typed settings via Pydantic.
"""

from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # Application Info
    APP_NAME: str = "VYTAL"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    APP_SECRET_KEY: str = "development-insecure-secret-key-change-in-production"

    # Server Configuration
    BACKEND_HOST: str = "127.0.0.1"
    BACKEND_PORT: int = 8000
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://peace4m.github.io",
    ]

    # Database Configuration
    # Defaults to async SQLite for friction-free local dev and automated tests
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./vytal.db",
        description="Async database connection string. Use postgresql+asyncpg for production."
    )

    # Security & Policy Limits
    MAX_UPLOAD_SIZE_MB: int = 5
    RATE_LIMIT_PER_MINUTE: int = 60
    SESSION_EXPIRATION_HOURS: int = 24

    # External Healthcare APIs (Normalization & Labels)
    RXNORM_API_BASE_URL: str = "https://rxnav.nlm.nih.gov/REST"
    OPENFDA_API_BASE_URL: str = "https://api.fda.gov/drug"
    OPENFDA_API_KEY: Optional[str] = None

    # Authentication (Supabase Auth)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: Optional[str] = None
    SUPABASE_AUDIENCE: str = "authenticated"

    # ML Research Engine
    ML_RANDOM_SEED: int = 42
    ML_MODEL_REGISTRY_DIR: str = "./ml/models"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }


settings = Settings()
