"""
Laboratory Report and Observation Models (Module 01)
Stores confirmed laboratory analytes, units, and printed reference ranges.
"""

from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Float, ForeignKey
from backend.app.database.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class LabReportModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "lab_reports"

    session_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    laboratory_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    report_date_str: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    parsing_engine: Mapped[str] = mapped_column(String(50), default="PyMuPDF", nullable=False)
    is_user_confirmed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    session = relationship("SessionModel", back_populates="reports")
    observations = relationship("LabObservationModel", back_populates="report", cascade="all, delete-orphan")


class LabObservationModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "lab_observations"

    report_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("lab_reports.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analyte_name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    standardized_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    observed_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    observed_value_str: Mapped[str] = mapped_column(String(100), nullable=False)
    unit: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    lab_reference_range: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ref_range_low: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    ref_range_high: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    status_flag: Mapped[str] = mapped_column(String(20), default="NORMAL", nullable=False)
    user_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    report = relationship("LabReportModel", back_populates="observations")
