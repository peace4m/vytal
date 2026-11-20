"""
VYTAL API v1 Router Aggregator
Combines endpoints across all five healthcare modules and the ML research engine.
"""

from fastapi import APIRouter

from backend.app.api.v1.endpoints.health import router as health_router
from backend.app.api.v1.endpoints.sessions import router as sessions_router
from backend.app.api.v1.endpoints.reports import router as reports_router
from backend.app.api.v1.endpoints.idrs import router as idrs_router
from backend.app.api.v1.endpoints.triage import router as triage_router
from backend.app.api.v1.endpoints.medications import router as medications_router
from backend.app.api.v1.endpoints.summary import router as summary_router
from backend.app.api.v1.endpoints.research import router as research_router

api_v1_router = APIRouter(prefix="/api/v1")

# System & Sessions
api_v1_router.include_router(health_router)
api_v1_router.include_router(sessions_router)

# The Five Healthcare Modules in Mandatory Sequence
api_v1_router.include_router(reports_router)      # Module 01: Report Explainer
api_v1_router.include_router(idrs_router)         # Module 02: IDRS
api_v1_router.include_router(triage_router)       # Module 03: Symptom Triage
api_v1_router.include_router(medications_router)  # Module 04: Medication Interaction Checker
api_v1_router.include_router(summary_router)      # Module 05: Health Summary

# Independent ML Research Subsystem
api_v1_router.include_router(research_router)
