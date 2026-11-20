"""
Session Database Model
Anonymous or authenticated user session tracking with privacy expiration.
"""

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, DateTime
from backend.app.database.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


def default_expires_at() -> datetime:
    return datetime.now(timezone.utc) + timedelta(hours=24)


class SessionModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "sessions"

    session_token: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        index=True,
        nullable=False,
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=default_expires_at,
        nullable=False,
        index=True,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    preferred_language: Mapped[str] = mapped_column(
        String(5),
        default="en",
        nullable=False,
    )

    # Relationships
    reports = relationship("LabReportModel", back_populates="session", cascade="all, delete-orphan")
    idrs_assessments = relationship("IDRSAssessmentModel", back_populates="session", cascade="all, delete-orphan")
    triage_assessments = relationship("TriageAssessmentModel", back_populates="session", cascade="all, delete-orphan")
    medication_checks = relationship("MedicationCheckModel", back_populates="session", cascade="all, delete-orphan")
    health_summaries = relationship("HealthSummaryModel", back_populates="session", cascade="all, delete-orphan")
