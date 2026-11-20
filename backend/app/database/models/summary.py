"""
Health Summary Model (Module 05)
Stores synthesized health briefs and export metrics.
"""

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, JSON, ForeignKey, Text
from backend.app.database.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class HealthSummaryModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "health_summaries"

    session_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    highest_acuity: Mapped[str] = mapped_column(String(30), nullable=False)
    consolidated_findings: Mapped[dict] = mapped_column(JSON, nullable=False)
    summary_text_en: Mapped[str] = mapped_column(Text, nullable=False)
    summary_text_hi: Mapped[str] = mapped_column(Text, nullable=False)
    summary_text_or: Mapped[str] = mapped_column(Text, nullable=False)
    pdf_download_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    session = relationship("SessionModel", back_populates="health_summaries")
