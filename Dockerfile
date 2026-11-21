# Production Dockerfile for VYTAL FastAPI Backend
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (build-essential and libpq for PostgreSQL drivers, curl for health checks)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies globally into system site-packages
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source, ML research artifacts, and database migrations
COPY backend /app/backend
COPY ml /app/ml
COPY alembic.ini /app/alembic.ini

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app
ENV PORT=8000

EXPOSE 8000

# Container health probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsSL http://localhost:8000/api/v1/health || exit 1

# Launch production Uvicorn server with dynamic port support (Render binds to $PORT dynamically)
CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
