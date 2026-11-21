"""
Clinical PDF Brief Generator (Module 05)
Generates audit-ready, beautifully formatted clinical decision-support PDF summaries
using ReportLab with metadata, timestamps, multi-module findings, and safety disclaimers.
"""

import io
from datetime import datetime, timezone
from typing import Dict, Any, List

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)

from backend.app.schemas.summary import HealthSummaryGenerateResponse


# Professional Clinical Color Palette (Teal / Slate / Navy)
TEAL_PRIMARY = colors.HexColor("#0D9488")
TEAL_DARK = colors.HexColor("#0F766E")
TEAL_LIGHT = colors.HexColor("#CCFBF1")
SLATE_NAVY = colors.HexColor("#0F172A")
SLATE_TEXT = colors.HexColor("#334155")
SLATE_MUTED = colors.HexColor("#64748B")
BORDER_COLOR = colors.HexColor("#CBD5E1")
ROSE_EMERGENCY = colors.HexColor("#BE123C")
ROSE_LIGHT = colors.HexColor("#FFE4E6")
AMBER_WARNING = colors.HexColor("#B45309")
AMBER_LIGHT = colors.HexColor("#FEF3C7")


class NumberedCanvas:
    """Canvas wrapper to compute total pages and add header/footer."""
    pass


def generate_health_summary_pdf(
    summary_data: HealthSummaryGenerateResponse,
    session_id: str = "N/A",
) -> bytes:
    """
    Renders a comprehensive, multi-page clinical decision-support PDF document in memory.
    Returns the binary PDF payload.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # Custom Typography Styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=SLATE_NAVY,
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=SLATE_MUTED,
    )
    section_heading = ParagraphStyle(
        "SectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=TEAL_DARK,
        spaceBefore=10,
        spaceAfter=4,
    )
    body_style = ParagraphStyle(
        "DocBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=SLATE_TEXT,
    )
    bold_body = ParagraphStyle(
        "DocBoldBody",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=12,
        textColor=SLATE_NAVY,
    )
    disclaimer_style = ParagraphStyle(
        "DocDisclaimer",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7,
        leading=9.5,
        textColor=SLATE_MUTED,
    )
    alert_style = ParagraphStyle(
        "DocAlert",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=13,
        textColor=ROSE_EMERGENCY,
    )

    story: List[Any] = []

    # 1. Header & Branding Banner
    header_data = [
        [
            Paragraph("<b>VYTAL</b> • Vytal360 Clinical Brief", title_style),
            Paragraph(
                f"<b>Document ID:</b> {summary_data.summary_id[:8]}<br/>"
                f"<b>Generated:</b> {summary_data.generated_at.strftime('%Y-%m-%d %H:%M UTC')}<br/>"
                f"<b>Session:</b> {session_id[:8]}",
                subtitle_style,
            ),
        ]
    ]
    header_table = Table(header_data, colWidths=[340, 200])
    header_table.setStyle(
        TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ])
    )
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=TEAL_PRIMARY, spaceBefore=4, spaceAfter=8))

    # 2. Executive Acuity Callout Banner
    acuity = summary_data.highest_acuity
    is_emerg = acuity == "EMERGENCY"
    is_high = acuity == "HIGH_ACUITY"

    bg_color = ROSE_LIGHT if is_emerg else (AMBER_LIGHT if is_high else TEAL_LIGHT)
    border_col = ROSE_EMERGENCY if is_emerg else (AMBER_WARNING if is_high else TEAL_PRIMARY)
    text_col = ROSE_EMERGENCY if is_emerg else (AMBER_WARNING if is_high else TEAL_DARK)

    banner_p = Paragraph(
        f"<b>CLINICAL ACUITY LEVEL: {acuity}</b> — "
        f"{'Emergency protocols active. Immediate clinical intervention required.' if is_emerg else 'Educational Decision-Support Summary. Subordinated to clinical judgment.'}",
        ParagraphStyle("BannerP", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9, textColor=text_col),
    )
    banner_table = Table([[banner_p]], colWidths=[540])
    banner_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), bg_color),
            ("BOX", (0, 0), (-1, -1), 1, border_col),
            ("PADDING", (0, 0), (-1, -1), 6),
        ])
    )
    story.append(banner_table)
    story.append(Spacer(1, 8))

    # 3. Section: Cross-Module Clinical Observations
    story.append(Paragraph("Cross-Module Synthesized Observations", section_heading))
    if summary_data.cross_module_insights:
        for item in summary_data.cross_module_insights:
            insight_content = [
                [
                    Paragraph(f"<b>[{item.category}] {item.title}</b>", bold_body),
                    Paragraph(f"<b>Acuity:</b> {item.severity}", subtitle_style),
                ],
                [
                    Paragraph(item.details, body_style),
                    "",
                ],
                [
                    Paragraph(f"<i>Source: {item.evidence_source or 'Clinical standard'}</i>", disclaimer_style),
                    Paragraph(f"<i>Notice: {item.boundary_notice or 'Educational only.'}</i>", disclaimer_style),
                ],
            ]
            itbl = Table(insight_content, colWidths=[420, 120])
            itbl.setStyle(
                TableStyle([
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("SPAN", (0, 1), (1, 1)),
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                    ("BOX", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
                    ("PADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 2), (-1, 2), 4),
                ])
            )
            story.append(itbl)
            story.append(Spacer(1, 4))
    else:
        story.append(Paragraph("No cross-module warnings or correlations triggered.", body_style))

    story.append(Spacer(1, 6))

    # 4. Section: Module 01 Confirmed Lab Observations
    story.append(Paragraph("01 — LabLens: Laboratory Report Interpretation", section_heading))
    if summary_data.module_01_report.has_data and summary_data.module_01_report.observations:
        table_rows = [
            [
                Paragraph("<b>Biomarker / Test Name</b>", bold_body),
                Paragraph("<b>Observed Value</b>", bold_body),
                Paragraph("<b>Unit</b>", bold_body),
                Paragraph("<b>Printed Reference Range</b>", bold_body),
                Paragraph("<b>Status Flag</b>", bold_body),
            ]
        ]
        for obs in summary_data.module_01_report.observations:
            status = obs.get("status", "NORMAL")
            status_p = Paragraph(
                f"<font color='{'#BE123C' if status in ('HIGH', 'ABNORMAL') else '#0F766E'}'><b>{status}</b></font>",
                body_style,
            )
            table_rows.append([
                Paragraph(obs.get("analyte_name", ""), body_style),
                Paragraph(str(obs.get("value", "")), body_style),
                Paragraph(obs.get("unit", ""), body_style),
                Paragraph(obs.get("reference_range", "") or "Not printed", body_style),
                status_p,
            ])
        lab_table = Table(table_rows, colWidths=[150, 80, 70, 160, 80])
        lab_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
                ("GRID", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
                ("PADDING", (0, 0), (-1, -1), 4),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ])
        )
        story.append(lab_table)
    else:
        story.append(Paragraph("No confirmed laboratory reports entered for this session.", body_style))

    story.append(Spacer(1, 6))

    # 5. Section: Module 02 IDRS Risk Score
    story.append(Paragraph("02 — RiskPulse: Indian Diabetes Risk Score (IDRS)", section_heading))
    if summary_data.module_02_idrs.has_data and summary_data.module_02_idrs.total_score is not None:
        idrs = summary_data.module_02_idrs
        idrs_rows = [
            [
                Paragraph(f"<b>Total Score:</b> {idrs.total_score} / 100", bold_body),
                Paragraph(f"<b>Risk Category:</b> {idrs.risk_category.upper() if idrs.risk_category else 'N/A'}", bold_body),
                Paragraph("<b>Citation:</b> Mohan et al. (JAPI 2005; 53:759-63)", subtitle_style),
            ],
            [
                Paragraph(
                    "<b>Interpretation:</b> Score >=60 indicates high risk for undiagnosed diabetes / prediabetes "
                    "(Sensitivity: 72.5%, Specificity: 60.1%). Fasting plasma glucose or HbA1c is recommended.",
                    body_style,
                ),
                "",
                "",
            ],
        ]
        idrs_table = Table(idrs_rows, colWidths=[160, 160, 220])
        idrs_table.setStyle(
            TableStyle([
                ("SPAN", (0, 1), (2, 1)),
                ("GRID", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("PADDING", (0, 0), (-1, -1), 5),
            ])
        )
        story.append(idrs_table)
    else:
        story.append(Paragraph("No IDRS assessment completed for this session.", body_style))

    story.append(Spacer(1, 6))

    # 6. Section: Module 03 Symptom Triage
    story.append(Paragraph("03 — SymptomSense: Rule-Based Symptom Triage", section_heading))
    if summary_data.module_03_triage.has_data:
        tri = summary_data.module_03_triage
        triage_rows = [
            [
                Paragraph(f"<b>Determined Acuity:</b> {tri.primary_acuity}", bold_body),
                Paragraph(f"<b>Emergency Override:</b> {'YES' if tri.emergency_override_triggered else 'NO'}", bold_body),
            ],
            [
                Paragraph(f"<b>Action Guidance:</b> {tri.action_required or 'Standard care'}", body_style),
                "",
            ],
            [
                Paragraph(f"<b>Safety-Netting:</b> {tri.safety_netting or 'N/A'}", disclaimer_style),
                "",
            ],
        ]
        triage_table = Table(triage_rows, colWidths=[270, 270])
        triage_table.setStyle(
            TableStyle([
                ("SPAN", (0, 1), (1, 1)),
                ("SPAN", (0, 2), (1, 2)),
                ("GRID", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("PADDING", (0, 0), (-1, -1), 5),
            ])
        )
        story.append(triage_table)
    else:
        story.append(Paragraph("No symptom triage questionnaire completed for this session.", body_style))

    story.append(Spacer(1, 6))

    # 7. Section: Module 04 Medication Interaction Review
    story.append(Paragraph("04 — MedWise: Evidence-Based Medication Review", section_heading))
    if summary_data.module_04_medications.has_data:
        med = summary_data.module_04_medications
        med_rows = [
            [
                Paragraph(f"<b>Total Medications Checked:</b> {med.total_medications}", bold_body),
                Paragraph(f"<b>Pairwise Interactions Found:</b> {med.interaction_count}", bold_body),
                Paragraph(f"<b>Severe Warning:</b> {'YES' if med.has_severe_warning else 'NO'}", bold_body),
            ],
            [
                Paragraph(f"<b>Mandatory Disclaimer:</b> {med.mandatory_disclaimer or 'Standard disclaimer applies.'}", disclaimer_style),
                "",
                "",
            ],
        ]
        med_table = Table(med_rows, colWidths=[180, 180, 180])
        med_table.setStyle(
            TableStyle([
                ("SPAN", (0, 1), (2, 1)),
                ("GRID", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("PADDING", (0, 0), (-1, -1), 5),
            ])
        )
        story.append(med_table)
    else:
        story.append(Paragraph("No medication interaction check conducted for this session.", body_style))

    story.append(Spacer(1, 12))

    # 8. Mandatory Safety Footer Notice
    footer_p = Paragraph(
        f"<b>IMPORTANT SAFETY & LEGAL DISCLAIMER:</b> {summary_data.mandatory_safety_disclaimer}<br/>"
        "VYTAL (Decision-Support Research Prototype) — NOT A MEDICAL DEVICE. NEVER ALTER PRESCRIBED MEDICATION.",
        disclaimer_style,
    )
    footer_table = Table([[footer_p]], colWidths=[540])
    footer_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
            ("BOX", (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ("PADDING", (0, 0), (-1, -1), 6),
        ])
    )
    story.append(footer_table)

    # Build Document
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
