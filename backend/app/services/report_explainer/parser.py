"""
PyMuPDF Sandboxed In-Memory Laboratory Report Parser (Module 01)
Safely extracts test names, observed values, units, and laboratory-printed reference ranges.
Never invents values, units, or reference ranges.
"""

import re
import uuid
from typing import List, Optional, Tuple, Dict, Any
import fitz  # PyMuPDF

from backend.app.schemas.reports import ExtractedLabItem
from backend.app.services.report_explainer.glossary import find_glossary_match

# Known clinical test names and regex patterns
KNOWN_TEST_PATTERNS = [
    (r"fasting\s+blood\s+(?:sugar|glucose)", "Fasting Blood Sugar (Glucose)"),
    (r"post\s*prandial\s+blood\s+(?:sugar|glucose)", "Postprandial Blood Sugar (PPBS)"),
    (r"ppbs|fbs", "Blood Glucose"),
    (r"hba1c|glycated\s+hemoglobin|glycosylated\s+hemoglobin", "HbA1c (Glycated Hemoglobin)"),
    (r"total\s+cholesterol", "Total Cholesterol"),
    (r"hdl\s+cholesterol", "HDL Cholesterol"),
    (r"ldl\s+cholesterol", "LDL Cholesterol"),
    (r"triglycerides", "Triglycerides"),
    (r"serum\s+creatinine|creatinine", "Serum Creatinine"),
    (r"blood\s+urea|urea", "Blood Urea"),
    (r"hemoglobin|haemoglobin", "Hemoglobin (Hb)"),
    (r"total\s+leukocyte\s+count|wbc\s+count|tlc", "Total Leukocyte Count (WBC)"),
    (r"platelet\s+count", "Platelet Count"),
    (r"thyroid\s+stimulating\s+hormone|tsh", "Thyroid Stimulating Hormone (TSH)"),
]

# Standard unit regex matching
UNIT_REGEX = re.compile(
    r"\b(mg/dL|g/dL|mmol/L|%|uIU/mL|mcIU/mL|IU/L|U/L|cells/cu\.?mm|/cu\.?mm|10\^3/uL|10\^6/uL|fL|pg|ng/mL)\b",
    re.IGNORECASE
)

# Reference range patterns (e.g., "70 - 100", "70.0 - 99.0", "< 5.7", "> 40", "0.6 - 1.2")
RANGE_REGEX = re.compile(
    r"(?:(?P<low>\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(?P<high>\d+(?:\.\d+)?)|(?:<|<=)\s*(?P<upper>\d+(?:\.\d+)?)|(?:>|>=)\s*(?P<lower>\d+(?:\.\d+)?))",
    re.IGNORECASE
)


class LabReportParser:
    """In-memory parser that extracts text using PyMuPDF and detects clinical parameters."""

    @classmethod
    def parse_pdf_bytes(cls, pdf_bytes: bytes) -> Tuple[Optional[str], Optional[str], List[ExtractedLabItem]]:
        """
        Parses PDF bytes in volatile memory.
        Returns (laboratory_name, report_date, list of extracted items).
        """
        extracted_items: List[ExtractedLabItem] = []
        lab_name: Optional[str] = None
        report_date: Optional[str] = None

        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as e:
            raise ValueError(f"Unable to parse file as PDF: {str(e)}")

        full_text = ""
        for page_num in range(min(len(doc), 10)):  # Max 10 pages safe limit
            page = doc[page_num]
            page_text = page.get_text("text")
            full_text += page_text + "\n"

        doc.close()  # Immediately close and release memory

        # Detect Lab Name & Date heuristics
        lines = [line.strip() for line in full_text.splitlines() if line.strip()]
        for line in lines[:15]:  # Look in header lines
            if any(term in line.lower() for term in ["pathology", "diagnostic", "laboratory", "lab", "hospital", "clinic"]):
                lab_name = line
                break

        date_match = re.search(r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b", full_text, re.IGNORECASE)
        if date_match:
            report_date = date_match.group(1)

        # Process line by line and with sliding windows
        extracted_items = cls.extract_parameters_from_text(lines)
        return lab_name, report_date, extracted_items

    @classmethod
    def extract_parameters_from_text(cls, lines: List[str]) -> List[ExtractedLabItem]:
        """Extracts candidate test rows from lines of text."""
        items: List[ExtractedLabItem] = []
        seen_analytes = set()

        for idx, line in enumerate(lines):
            for pattern, canonical_name in KNOWN_TEST_PATTERNS:
                if canonical_name in seen_analytes:
                    continue

                if re.search(pattern, line, re.IGNORECASE):
                    # We found a candidate line. Search in current line and next 2 lines for numbers, unit, and range.
                    context_chunk = " ".join(lines[idx:idx + 3])
                    parsed_item = cls._parse_candidate_chunk(canonical_name, context_chunk)
                    if parsed_item:
                        items.append(parsed_item)
                        seen_analytes.add(canonical_name)
                    break

        return items

    @classmethod
    def _parse_candidate_chunk(cls, canonical_name: str, text_chunk: str) -> Optional[ExtractedLabItem]:
        """Parses an analyte chunk into an ExtractedLabItem."""
        # Find unit if present
        unit_match = UNIT_REGEX.search(text_chunk)
        unit = unit_match.group(1) if unit_match else None

        # Find reference range if printed
        range_match = RANGE_REGEX.search(text_chunk)
        ref_range_str = None
        ref_low = None
        ref_high = None

        if range_match:
            ref_range_str = range_match.group(0).strip()
            if range_match.group("low") and range_match.group("high"):
                ref_low = float(range_match.group("low"))
                ref_high = float(range_match.group("high"))
            elif range_match.group("upper"):
                ref_high = float(range_match.group("upper"))
            elif range_match.group("lower"):
                ref_low = float(range_match.group("lower"))

        # Find numbers in the chunk that are not part of the reference range
        remaining_text = text_chunk
        if ref_range_str:
            remaining_text = text_chunk.replace(ref_range_str, " ")

        number_matches = re.findall(r"\b(\d+(?:\.\d+)?)\b", remaining_text)
        if not number_matches:
            return None

        # Select observed value (heuristic: first or last number before unit)
        observed_val = float(number_matches[0])
        observed_val_str = f"{observed_val} {unit}".strip() if unit else str(observed_val)

        # Determine status flag based strictly on printed lab range
        status_flag = "NORMAL"
        if ref_low is not None and observed_val < ref_low:
            status_flag = "LOW"
        elif ref_high is not None and observed_val > ref_high:
            status_flag = "HIGH"
        elif ref_range_str is None:
            status_flag = "INDETERMINATE"

        # Calculate extraction confidence
        confidence = 0.70
        if unit:
            confidence += 0.15
        if ref_range_str:
            confidence += 0.15

        return ExtractedLabItem(
            temp_id=f"item-{uuid.uuid4().hex[:8]}",
            analyte_name=canonical_name,
            observed_value=observed_val,
            observed_value_str=observed_val_str,
            unit=unit,
            lab_reference_range=ref_range_str,
            ref_range_low=ref_low,
            ref_range_high=ref_high,
            status_flag=status_flag,
            extraction_confidence=round(confidence, 2),
        )
