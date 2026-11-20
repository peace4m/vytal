"""
Medication Interaction Models (Module 04)
Stores checked drug pairs, RxCUIs, and detected interactions.
"""

from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Boolean, ForeignKey, Text
from backend.app.database.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class MedicationCheckModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "medication_checks"

    session_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    drug_count: Mapped[int] = mapped_column(Integer, nullable=False)
    interaction_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    has_contraindication: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    session = relationship("SessionModel", back_populates="medication_checks")
    items = relationship("MedicationCheckItemModel", back_populates="check", cascade="all, delete-orphan")
    interactions = relationship("DetectedInteractionModel", back_populates="check", cascade="all, delete-orphan")


class MedicationCheckItemModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "medication_check_items"

    check_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("medication_checks.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    input_name: Mapped[str] = mapped_column(String(150), nullable=False)
    rxcui: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    normalized_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    drug_class: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    normalization_status: Mapped[str] = mapped_column(String(30), default="MATCHED", nullable=False)

    # Relationships
    check = relationship("MedicationCheckModel", back_populates="items")


class DetectedInteractionModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "detected_interactions"

    check_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("medication_checks.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    drug_a_name: Mapped[str] = mapped_column(String(150), nullable=False)
    drug_a_rxcui: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    drug_b_name: Mapped[str] = mapped_column(String(150), nullable=False)
    drug_b_rxcui: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    severity: Mapped[str] = mapped_column(String(30), nullable=False)
    clinical_description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_source: Mapped[str] = mapped_column(String(255), nullable=False)
    management_advice: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    check = relationship("MedicationCheckModel", back_populates="interactions")
