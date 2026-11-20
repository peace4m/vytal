"""
VYTAL: Explainable, Multilingual Healthcare Decision-Support Platform
FastAPI Application Entrypoint
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from backend.app.core.config import settings
from backend.app.core.logging import setup_logging, logger
from backend.app.database.session import init_db
from backend.app.api.v1.router import api_v1_router
from backend.app.schemas.errors import ProblemDetails, InvalidParam


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan event handler: sets up logging and initializes DB tables."""
    setup_logging(debug=settings.DEBUG)
    logger.info("Initializing VYTAL Backend...")
    try:
        await init_db()
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
    yield
    logger.info("VYTAL Backend shutting down.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="VYTAL: An Explainable, Multilingual Healthcare Decision-Support Platform Integrating Clinical Rules and Machine Learning.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handler: RFC 7807 Problem Details for Request Validation Errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    invalid_params = []
    for err in exc.errors():
        loc_str = " -> ".join(str(l) for l in err.get("loc", []))
        invalid_params.append(
            InvalidParam(name=loc_str, reason=err.get("msg", "Invalid value"))
        )

    problem = ProblemDetails(
        type="https://vytal.health/errors/validation-error",
        title="Unprocessable Entity",
        status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="The request payload failed schema validation.",
        instance=str(request.url.path),
        invalid_params=invalid_params,
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=problem.model_dump(mode="json"),
    )


# Attach API v1 Router
app.include_router(api_v1_router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "platform": settings.APP_NAME,
        "tagline": "Your Health, Decoded.",
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs_url": "/docs",
        "api_v1_base": "/api/v1",
        "safety_notice": "Educational and research prototype. Not a medical device. Never replaces qualified medical professionals.",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=settings.DEBUG,
    )
