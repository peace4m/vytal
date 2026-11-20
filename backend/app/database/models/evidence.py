"""
Clinical Evidence Source Model
Bibliographic tracking of clinical guidelines, validated formulas, and interaction sources.
"""

from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text
from backend.app.database.base import Base, TimestampMixin


class EvidenceSourceModel(Base, TimestampMixin):
    __tablename__ = "evidence_sources"

    source_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    authors: Mapped[str] = mapped_column(Text, nullable=False)
    publication_venue: Mapped[str] = mapped_column(String(255), nullable=False)
    publication_year: Mapped[int] = mapped_column(Integer, nullable=False)
    doi_pmid: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    evidence_level: Mapped[str] = mapped_column(String(50), nullable=False)
    last_verified_at: Mapped[str] = mapped_column(String(20), nullable=False)
