# VYTAL Security & Data Incident Response Plan

**Document Version:** 1.0  
**Effective Date:** November 2026  
**Applicability:** VYTAL Platform (Web, Mobile, Backend, Cloud Database, and CI/CD Infrastructure)  
**Governance Flag:** Flagged for legal verification regarding exact notification deadlines under India's Digital Personal Data Protection (DPDP) Act and CERT-In directions.

---

## 1. Purpose & Incident Scope

This document specifies the standard operating procedures for detecting, containing, investigating, and remediating security incidents and potential personal data breaches involving Project VYTAL.

An **Incident** is defined as any confirmed or suspected event compromising the confidentiality, integrity, or availability of personal data, clinical measurements, system credentials, or cloud infrastructure.

---

## 2. Nine-Stage Incident Lifecycle

```
[1. Detection & Triage]
       ↓
[2. Containment & Isolation]
       ↓
[3. Investigation & Root Cause]
       ↓
[4. Evidence Preservation]
       ↓
[5. Impact Assessment]
       ↓
[6. Notification & Disclosure]
       ↓
[7. Remediation & Recovery]
       ↓
[8. Post-Incident Review]
       ↓
[9. Corrective Action Plan]
```

### Stage 1: Detection & Triage
* **Sources:** Sentry error spikes, automated GitHub secret scanning alerts, cloud host anomaly alerts, database access logs, or vulnerability reports received at `privacy@vytal.health`.
* **Initial Classification:**
  * **P0 — Critical:** Exposure of personal health data, compromised database service keys, or unauthorized database exfiltration.
  * **P1 — High:** Compromised user authentication credentials or service disruption.
  * **P2 — Moderate:** Isolated client-side anomaly or non-sensitive log exposure.

### Stage 2: Immediate Containment
* **Credential Invalidation:** If an API key or database secret is compromised, immediately rotate keys in Supabase Cloud and hosting platforms.
* **Network & Session Isolation:** Invalidate compromised sessions (`supabase.auth.admin.signOut` / token revocation). If required, activate maintenance mode or temporarily pause API routes.
* **Code Quarantine:** Revert offending commits or rollback to the latest known secure deployment.

### Stage 3: Technical Investigation
* Identify the entry vector (e.g., misconfigured CORS, unauthenticated endpoint, compromised third-party package).
* Trace query logs in Supabase and container hosting to establish whether unauthorized data retrieval occurred.
* Determine exact affected database IDs and timestamps.

### Stage 4: Evidence Preservation
* Capture immutable copies of container logs, web server access logs, and database transaction queries before resetting instances.
* Store forensic artifacts in an access-restricted, read-only location with cryptographic checksums (SHA-256).

### Stage 5: Impact Assessment
* Evaluate the categories of data impacted (e.g., email addresses, extracted lab values, risk scores).
* Determine the volume of individuals affected.
* Evaluate potential harm to affected individuals (e.g., clinical confusion, privacy harm).

### Stage 6: Notification & Disclosure
* **Regulatory Reporting:** Report to CERT-In (within mandatory 6-hour window for specified cybersecurity incidents where legally applicable) and to the Data Protection Board of India under DPDP Act rules.
  > *Note: Exact timelines and reporting forms are subject to active legal verification with qualified data protection counsel.*
* **User Notification:** Provide affected users with clear, plain-language notification detailing:
  1. Nature of the incident.
  2. Data categories involved.
  3. Steps taken by VYTAL to contain the breach.
  4. Recommended protective actions (e.g., password reset).
  5. Grievance officer contact details.

### Stage 7: Remediation & Recovery
* Patch code vulnerabilities and verify via automated regression tests.
* Reseed compromised cryptographic tokens and redeploy cleanly from source.
* Restore database state from verified uncorrupted snapshots if integrity was compromised.

### Stage 8: Post-Incident Review (Blameless Retrospective)
* Convene within 5 business days of incident resolution.
* Document timeline, detection delay, containment efficiency, and gaps in automated monitoring.

### Stage 9: Corrective Action Tracking
* Create tracked GitHub issues for infrastructure hardening, additional CI checks, or policy updates with strict assignment and completion deadlines.

---

## 3. Incident Log Template

Every incident must be documented in a private, encrypted log using the following structure:

| Field | Description / Value |
| :--- | :--- |
| **Incident ID** | `INC-YYYYMMDD-01` |
| **Date & Time Detected** | `YYYY-MM-DD HH:MM UTC` |
| **Discovery Mechanism** | Automated monitoring / User report / Secret scan / Internal QA |
| **Severity Level** | P0 (Critical) / P1 (High) / P2 (Medium) |
| **Incident Lead** | Designated Technical / Security Lead |
| **Systems Involved** | Supabase Postgres / FastAPI Backend / GitHub Actions / Frontend |
| **Data Types Involved** | Account metadata / Lab observations / Symptoms / Zero PHI |
| **Estimated Scope** | Number of unique accounts / records affected |
| **Containment Action Taken** | Key rotated / Session revoked / Endpoint patched |
| **Containment Timestamp** | `YYYY-MM-DD HH:MM UTC` |
| **Notification Requirement** | DPDP Board: Yes/No • Users: Yes/No • CERT-In: Yes/No |
| **Resolution Summary** | Description of permanent code fix and deployment hash |
| **Retrospective Date** | Scheduled date for post-incident review |
| **Sign-Off** | Security Lead & Legal Representative |

---

## 4. Emergency Contact & Escalation Protocol

* **Security & Grievance Contact:** `privacy@vytal.health`
* **Repository Vulnerability Reporting:** GitHub Private Vulnerability Reporting (`https://github.com/peace4m/vytal/security/advisories`)
* **Lead Maintainer Escalation:** Direct escalation to project maintainers via verified repository communication channels.
