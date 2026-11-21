/**
 * Client-Side Clinical Brief Document Generator
 * Generates audit-ready clinical decision-support summaries in pure JavaScript
 * when the backend ReportLab engine is unreachable or running on static hosting.
 */

export function downloadClientSummaryReport(summary: any) {
  const summaryId = (summary?.summary_id || 'CLINICAL-BRIEF').slice(0, 8);
  const dateStr = summary?.generated_at
    ? new Date(summary.generated_at).toLocaleString()
    : new Date().toLocaleString();
  const highestAcuity = summary?.highest_acuity || 'ROUTINE';

  const m1 = summary?.module_01_report || {};
  const m2 = summary?.module_02_idrs || {};
  const m3 = summary?.module_03_triage || {};
  const m4 = summary?.module_04_medications || {};
  const insights = summary?.cross_module_insights || [];

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VYTAL Clinical Health Summary — ${summaryId}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #0d9488;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand {
      font-size: 28px;
      font-weight: 900;
      color: #0d9488;
      letter-spacing: -0.5px;
    }
    .tagline {
      font-size: 13px;
      color: #64748b;
      margin-top: 2px;
    }
    .meta-table {
      width: 100%;
      margin-top: 16px;
      font-size: 13px;
      border-collapse: collapse;
    }
    .meta-table td {
      padding: 6px 0;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      background: ${highestAcuity === 'EMERGENCY' ? '#ffe4e6' : highestAcuity === 'HIGH_ACUITY' ? '#fef3c7' : '#ccfbf1'};
      color: ${highestAcuity === 'EMERGENCY' ? '#9f1239' : highestAcuity === 'HIGH_ACUITY' ? '#92400e' : '#0f766e'};
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 12px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      background: #f8fafc;
    }
    .card-title {
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .card-desc {
      font-size: 12px;
      color: #334155;
    }
    .card-source {
      font-size: 11px;
      color: #64748b;
      margin-top: 8px;
      border-top: 1px solid #e2e8f0;
      padding-top: 4px;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 8px;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    table.data-table th {
      background: #f1f5f9;
      font-weight: 700;
    }
    .disclaimer-box {
      border: 1px solid #fecaca;
      background: #fef2f2;
      border-radius: 8px;
      padding: 14px;
      margin-top: 32px;
      font-size: 11px;
      color: #991b1b;
      line-height: 1.6;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <div>
        <div class="brand">VYTAL</div>
        <div class="tagline">Your Health, Decoded. — Clinical Decision-Support Brief</div>
      </div>
      <div>
        <span class="badge">${highestAcuity} ACUITY</span>
      </div>
    </div>
    <table class="meta-table">
      <tr>
        <td><strong>Document ID:</strong> ${summaryId}</td>
        <td style="text-align: right;"><strong>Timestamp:</strong> ${dateStr}</td>
      </tr>
      <tr>
        <td><strong>Platform:</strong> VYTAL Clinical Informatics v0.1.0</td>
        <td style="text-align: right;"><strong>Status:</strong> Audited Multi-Module Record</td>
      </tr>
    </table>
  </div>

  <div class="section-title">1. Cross-Module Synthesized Clinical Observations</div>
  ${
    insights.length > 0
      ? insights
          .map(
            (item: any) => `
    <div class="card">
      <div class="card-title">${item.title} [${item.severity}]</div>
      <div class="card-desc">${item.details}</div>
      ${item.evidence_source ? `<div class="card-source">Evidence Source: ${item.evidence_source}</div>` : ''}
    </div>`
          )
          .join('')
      : '<p style="font-size: 12px; color: #64748b;">No cross-module conflict or escalation triggers identified.</p>'
  }

  <div class="section-title">2. Module Audit Trail</div>

  <div class="card">
    <div class="card-title">01 — LabLens (Laboratory Observations)</div>
    ${
      m1.has_data && Array.isArray(m1.observations) && m1.observations.length > 0
        ? `
      <table class="data-table">
        <thead>
          <tr>
            <th>Analyte Name</th>
            <th>Observed Value</th>
            <th>Reference Interval</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          ${m1.observations
            .map(
              (o: any) => `
            <tr>
              <td><strong>${o.analyte_name}</strong></td>
              <td>${o.value || ''}</td>
              <td>${o.reference_range || 'N/A'}</td>
              <td><span style="color: ${o.status === 'HIGH' ? '#dc2626' : '#16a34a'}; font-weight: bold;">${o.status}</span></td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>`
        : '<p class="card-desc">No laboratory report observations confirmed in current session.</p>'
    }
  </div>

  <div class="card">
    <div class="card-title">02 — RiskPulse (Indian Diabetes Risk Score)</div>
    ${
      m2.has_data
        ? `
      <p class="card-desc">
        <strong>Total Score:</strong> ${m2.total_score ?? 'N/A'} / 100 — 
        <strong>Risk Tier:</strong> ${m2.risk_category ?? 'N/A'}
      </p>
      <div class="card-source">Citation: Mohan V et al. A Simplified Indian Diabetes Risk Score. JAPI 2005; 53:759–763.</div>`
        : '<p class="card-desc">No IDRS assessment completed in current session.</p>'
    }
  </div>

  <div class="card">
    <div class="card-title">03 — SymptomSense (Clinical Rule Triage)</div>
    ${
      m3.has_data
        ? `
      <p class="card-desc">
        <strong>Determined Acuity:</strong> ${m3.primary_acuity ?? 'ROUTINE'} | 
        <strong>Emergency Override:</strong> ${m3.emergency_override_triggered ? 'YES' : 'NO'}<br/>
        <strong>Recommended Action:</strong> ${m3.action_required ?? 'Standard consultation'}<br/>
        <strong>Safety Guidance:</strong> ${m3.safety_netting ?? 'Monitor symptoms'}
      </p>
      <div class="card-source">Protocols: NICE Clinical Guidelines (CG95), AHA BE-FAST Stroke, WHO ETAT</div>`
        : '<p class="card-desc">No symptom triage assessment completed in current session.</p>'
    }
  </div>

  <div class="card">
    <div class="card-title">04 — MedWise (Medication Interaction Check)</div>
    ${
      m4.has_data
        ? `
      <p class="card-desc">
        <strong>Medications Evaluated:</strong> ${m4.total_medications || (m4.medications_checked || []).length}<br/>
        <strong>Interactions Identified:</strong> ${m4.interaction_count || (m4.interactions || []).length}
        ${m4.has_severe_warning ? ' — <strong style="color: #dc2626;">Severe / Contraindicated Warning Present</strong>' : ''}
      </p>
      <div class="card-source">Standard: NIH RxNorm Terminology & ONC High-Priority Drug Interaction Registry</div>`
        : '<p class="card-desc">No medication interaction check completed in current session.</p>'
    }
  </div>

  <div class="disclaimer-box">
    <strong>MANDATORY NON-DEVICE & REGULATORY NOTICE:</strong><br/>
    VYTAL is strictly an educational and informatics decision-support prototype. It is NOT a medical device,
    does NOT diagnose medical conditions, and does NOT prescribe, initiate, or alter medication dosages.
    All assessments are based on published scoring protocols and user-confirmed data.
    Patients must review these findings with a licensed healthcare practitioner before making any clinical decisions.
  </div>
</body>
</html>
`;

  // Create printable blob window or download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  } else {
    // Fallback: download file directly
    const a = document.createElement('a');
    a.href = url;
    a.download = `VYTAL_Health_Summary_${summaryId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
