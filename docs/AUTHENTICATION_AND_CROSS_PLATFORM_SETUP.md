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
In `mobile/.env` (or set as environment variables):
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
