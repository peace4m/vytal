"""
Indian Diabetes Risk Score Model (Module 02)
Stores validated IDRS parameters, factor points, and risk classification.
"""

from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, ForeignKey
from backend.app.database.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class IDRSAssessmentModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "idrs_assessments"

    session_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(64),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    # Parameters
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    age_points: Mapped[int] = mapped_column(Integer, nullable=False)
    
    gender: Mapped[str] = mapped_column(String(10), nullable=False)
    waist_circumference_cm: Mapped[float] = mapped_column(Float, nullable=False)
    waist_points: Mapped[int] = mapped_column(Integer, nullable=False)
    
    physical_activity_tier: Mapped[str] = mapped_column(String(50), nullable=False)
    activity_points: Mapped[int] = mapped_column(Integer, nullable=False)
    
    family_history_tier: Mapped[str] = mapped_column(String(50), nullable=False)
    family_history_points: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # Results
    total_score: Mapped[int] = mapped_column(Integer, nullable=False)
    risk_category: Mapped[str] = mapped_column(String(20), nullable=False)
    validation_reference: Mapped[str] = mapped_column(
        String(150),
        default="Mohan et al. JAPI 2005; 53:759-763",
        nullable=False,
    )

    # Relationships
    session = relationship("SessionModel", back_populates="idrs_assessments")
