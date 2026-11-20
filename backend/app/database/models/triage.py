"""
Symptom Triage and Clinical Rule Models (Module 03)
Stores deterministic clinical decision rules and audit records of triggered rules.
"""

from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, JSON, ForeignKey, Text
from backend.app.database.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class ClinicalRuleModel(Base, TimestampMixin):
    __tablename__ = "clinical_rules"

    rule_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    rule_name: Mapped[str] = mapped_column(String(150), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    priority_tier: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    logic_predicate: Mapped[dict] = mapped_column(JSON, nullable=False)
    evidence_source_id: Mapped[str] = mapped_column(String(50), nullable=False)
    version: Mapped[str] = mapped_column(String(20), default="1.0.0", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    review_status: Mapped[str] = mapped_column(String(30), default="APPROVED", nullable=False)
    effective_date: Mapped[str] = mapped_column(String(20), nullable=False)

    # Relationships
    executions = relationship("TriageRuleExecutionModel", back_populates="rule")


class TriageAssessmentModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "triage_assessments"

    session_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    input_symptoms: Mapped[dict] = mapped_column(JSON, nullable=False)
    primary_acuity: Mapped[str] = mapped_column(String(30), nullable=False)
    emergency_override_triggered: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    recommended_action: Mapped[str] = mapped_column(Text, nullable=False)
    safety_netting_advice: Mapped[str] = mapped_column(Text, nullable=False)

    # Relationships
    session = relationship("SessionModel", back_populates="triage_assessments")
    rule_executions = relationship("TriageRuleExecutionModel", back_populates="triage", cascade="all, delete-orphan")


class TriageRuleExecutionModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "triage_rule_executions"

    triage_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("triage_assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    rule_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("clinical_rules.rule_id"),
        nullable=False,
    )
    triggered_reason: Mapped[str] = mapped_column(Text, nullable=False)
    clinical_action: Mapped[str] = mapped_column(Text, nullable=False)

    # Relationships
    triage = relationship("TriageAssessmentModel", back_populates="rule_executions")
    rule = relationship("ClinicalRuleModel", back_populates="executions")
