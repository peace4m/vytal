# VYTAL Cross-Platform & Authentication Setup Guide

This document details the configuration for running VYTAL across **Android, iOS, and Web** with **Supabase Auth** and the **FastAPI backend**.

---

## 1. Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │          VYTAL Universal App           │
                      │  Expo SDK 52 + React Native + Web      │
                      └──────────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
    ┌───────────────────────────┐                 ┌───────────────────────────┐
    │       Supabase Auth       │                 │      FastAPI Backend      │
    │  Email, Google, Apple     │                 │   JWT Token Verification  │
    │  PKCE & SecureStore       │                 │   5 Clinical Modules      │
    └───────────────────────────┘                 │   ML Research Subsystem   │
                                                  └───────────────────────────┘
```

---

## 2. Supabase Authentication Setup

### Step A: Create a Supabase Project
1. Log in to [https://supabase.com](https://supabase.com) and create a new project (e.g. `vytal-health`).
2. Go to **Project Settings** → **API**:
   - Copy **Project URL**
   - Copy **anon / public key**
   - Copy **JWT Secret** (under JWT Settings)

### Step B: Configure Frontend Environment
In `frontend/.env` (Web Vite App):
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

In `mobile/.env` (Expo Native & Web):
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
```
*(On Android physical devices or emulators, set `EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api/v1` or your LAN IP).*

### Step C: Configure Backend JWT Verification
In `.env` at the root of the project:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
SUPABASE_AUDIENCE=authenticated
```

---

## 3. Database Row-Level Security (RLS) Policies

When deploying to Supabase PostgreSQL, execute the following SQL migration in the Supabase SQL Editor to enforce patient data isolation:

```sql
-- 1. Enable Row-Level Security across all health tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE idrs_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_summaries ENABLE ROW LEVEL SECURITY;

-- 2. User Profile Policy (Strict Self-Access)
CREATE POLICY "Users can only read and update own profile"
  ON users
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Sessions Policy
CREATE POLICY "Users access own sessions"
  ON sessions
  FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 4. Healthcare Data Isolation Policies
CREATE POLICY "Users access own lab reports"
  ON lab_reports
  FOR ALL
  USING (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users access own IDRS assessments"
  ON idrs_assessments
  FOR ALL
  USING (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users access own symptom triage logs"
  ON triage_assessments
  FOR ALL
  USING (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users access own medication reviews"
  ON medication_checks
  FOR ALL
  USING (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users access own consolidated health summaries"
  ON health_summaries
  FOR ALL
  USING (session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid()));
```

---

## 3. Google OAuth & Sign In with Apple Configuration

### Google OAuth
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create an **OAuth 2.0 Client ID**:
   - **Web Application**: Add Authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
   - **Android Client ID**: Provide package name `health.vytal.app` and your SHA-1 signing fingerprint.
   - **iOS Client ID**: Provide bundle identifier `health.vytal.app`.
3. In Supabase Dashboard → **Authentication** → **Providers** → **Google**:
   - Enable Google and paste your Client ID and Client Secret.

### Sign In with Apple
1. In the [Apple Developer Portal](https://developer.apple.com/):
   - Register App ID: `health.vytal.app` with **Sign In with Apple** capability.
   - Create a Services ID for web/redirects.
   - Generate a Private Key (`.p8`).
2. In Supabase Dashboard → **Authentication** → **Providers** → **Apple**:
   - Enable Apple and input Service ID, Team ID, Key ID, and `.p8` secret.

---

## 4. How to Run the Platform

### Running the FastAPI Backend
```powershell
cd C:\Users\sthit\.gemini\antigravity\scratch\vytal
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --port 8000
```
- Swagger Documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/v1/health`

### Running the Cross-Platform Expo Application
```powershell
cd C:\Users\sthit\.gemini\antigravity\scratch\vytal\mobile

# Run in Web Browser
npm run web

# Run on Android Emulator or Physical Device via Expo Go
npm run android

# Run on iOS Simulator or iPhone via Expo Go
npm run ios
```

---

## 5. Security & Clinical Safety Invariants

1. **Non-Diagnostic Policy**: VYTAL is an educational decision-support platform. It never issues diagnoses or dictates medication alterations.
2. **Emergency Red-Flag Priority**: Deterministic emergency triage rules (AHA/ACC chest pain, FAST stroke alert, DKA) execute with absolute priority and call for immediate **108 / 112** activation.
3. **Language Invariant**: Changing language between English, Hindi, Odia, or regional tongues updates **only** the presentation layer, leaving underlying clinical math, scoring boundaries, and rules unaltered.
4. **Prescription Non-Interference**: Drug interaction reviews explicitly state negative finding limits and remind patients to consult their doctor or pharmacist.
