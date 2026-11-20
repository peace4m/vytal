# Multilingual Architecture & Localization Strategy

- **Document Version**: 1.0.0
- **Document Date**: 2026-11-21
- **Status**: Finalized Localization Blueprint
- **Supported Languages**: English (`en`), Hindi (`hi`), Odia (`or`)
- **Technology Stack**: `i18next`, `react-i18next`, Unicode 15.0, Google Noto Typography

---

## 1. Vision & Multilingual Philosophy

In the Indian subcontinent, healthcare information asymmetry is deeply intertwined with linguistic barriers. While over 80% of clinical laboratory reports are authored exclusively in English medical jargon, less than 12% of the Indian population speaks English fluently. 

VYTAL bridges this critical divide by treating multilingualism as a core clinical accessibility requirement rather than a cosmetic overlay:
1. **Plain-Language Demystification**: Translating clinical concepts into intuitive, patient-friendly idioms rather than obscure direct transliterations.
2. **Clinical Safety Preservation**: Ensuring that emergency red flags and clinical instructions carry zero semantic ambiguity across languages.
3. **Regional Inclusivity**: Launching with **English**, **Hindi** (widely spoken national language), and **Odia** (classical eastern Indian language with under-represented healthtech tooling), with architectural readiness for Bengali, Telugu, Tamil, and Marathi.

---

## 2. Stratified Translation Taxonomy

To safeguard clinical accuracy and manage translation workflows, localization strings are partitioned into five distinct governance tiers:

```
Tier 1: UI Interface Strings (Low Clinical Risk)
├── Navigation links, button labels, tabs, theme toggles, loading spinners.
└── Governed by standard software i18n processes.

Tier 2: Medical Terminology (Moderate Clinical Risk)
├── Analyte names (e.g., "Fasting Blood Sugar", "HbA1c", "Serum Creatinine").
└── Dual display: Native term paired with standard English/medical name to prevent lab confusion.

Tier 3: Clinical Explanations (High Clinical Risk)
├── Plain-language explanations of test results, IDRS factor interpretations, lifestyle advice.
└── Requires review by medical writers / bilingual clinicians.

Tier 4: Emergency Alerts & Red Flags (Critical Clinical Risk)
├── Urgent call-to-action notices (e.g., "Seek immediate emergency medical care / Call 108").
└── STRICT PROHIBITION: Zero unreviewed automated machine translation. Must be 100% human-verified.

Tier 5: Legal & Safety Disclaimers (Regulatory Risk)
├── Non-device prototype disclaimers, prescription non-interference clauses, privacy notices.
└── Standardized legal translation reviewed for statutory fidelity.
```

---

## 3. Technical Architecture & State Preservation

### 3.1 Frontend i18n Framework (`i18next`)
- **Framework**: `react-i18next` coupled with `i18next-browser-languagedetector`.
- **Dynamic Resource Bundles**: Structured JSON catalogs separated by language and domain namespaces:
  ```
  frontend/src/i18n/
  ├── en/
  │   ├── common.json         # Tier 1: UI components
  │   ├── medical.json        # Tier 2: Lab terminology
  │   ├── clinical.json       # Tier 3: Explanations & IDRS
  │   └── emergency.json      # Tier 4: Red flags & disclaimers
  ├── hi/
  │   ├── common.json
  │   ├── medical.json
  │   ├── clinical.json
  │   └── emergency.json
  └── or/
      ├── common.json
      ├── medical.json
      ├── clinical.json
      └── emergency.json
  ```

### 3.2 Dynamic Language Switching Without State Loss
A critical user experience failure in naive i18n implementations is form reset during language toggle. 
In VYTAL:
- The active language code (`currentLanguage`) is stored in React Context and synchronized with `localStorage`.
- All user-entered form values (e.g., confirmed lab numbers, IDRS parameters, selected symptoms) reside in decoupled React Hook Form / TanStack Query caches that store **canonical, language-agnostic data structures**.
- Toggling the language selector re-renders the string presentation layer **instantaneously** without clearing or modifying active form inputs or session states.

---

## 4. Typography, Scripts & Layout Considerations

### 4.1 Script Characteristics & Web Fonts

| Language | Script | Writing System | Recommended Web Font | Fallback Stack |
| :--- | :--- | :--- | :--- | :--- |
| **English** (`en`) | Latin | Left-to-Right | Inter / Poppins | system-ui, sans-serif |
| **Hindi** (`hi`) | Devanagari | Left-to-Right | **Noto Sans Devanagari** | Mangal, Arial Unicode MS |
| **Odia** (`or`) | Odia (Oriya) | Left-to-Right | **Noto Sans Oriya** | Kalinga, Arial Unicode MS |

### 4.2 Text Expansion & Container Geometry
- **Expansion Ratios**:
  - Hindi text is typically **15% to 25% longer** than equivalent English prose.
  - Odia text is typically **20% to 35% longer** due to complex conjunct characters and vowel matras.
- **CSS Invariants**:
  - Flexible layout containers with responsive `min-height` and Tailwind `flex-wrap` / `grid` instead of rigid fixed-height boxes.
  - Increased line-height (`leading-relaxed` or `line-height: 1.6`) for Devanagari and Odia to prevent clipping of top and bottom matras (diacritics).
  - Text-overflow handling: Avoid aggressive character truncation (`text-ellipsis`) on clinical alert cards; text must wrap completely so no life-critical instructions are hidden.

---

## 5. Multilingual Translation Validation Matrix (Sample Terms)

| English (`en`) | Hindi (`hi`) | Odia (`or`) | Clinical Review Status |
| :--- | :--- | :--- | :---: |
| **Your Health, Decoded.** | आपका स्वास्थ्य, सरल शब्दों में। | ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ, ସରଳ ଭାଷାରେ। | APPROVED |
| **Fasting Blood Sugar** | खाली पेट रक्त शर्करा (Fasting Blood Sugar) | ଖାଲି ପେଟ ରକ୍ତ ଶର୍କରା (Fasting Blood Sugar) | APPROVED |
| **Waist Circumference** | कमर का घेरा (Waist Circumference) | ଅଣ୍ଟାର ଘେର (Waist Circumference) | APPROVED |
| **Seek immediate emergency care** | तुरंत आपातकालीन चिकित्सा सहायता लें | ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା ସହାୟତା ନିଅନ୍ତୁ | APPROVED |
| **This tool does not diagnose diseases.** | यह उपकरण किसी बीमारी का निदान नहीं करता है। | ଏହି ଉପକରଣ କୌଣସି ରୋଗର ଚିକିତ୍ସା ବା ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ। | APPROVED |
| **Never stop or alter prescribed medicines.** | डॉक्टर की सलाह के बिना कोई भी दवा बंद या शुरू न करें। | ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ବିନା କୌଣସି ଔଷଧ ବନ୍ଦ କରନ୍ତୁ ନାହିଁ କିମ୍ବା ବଦଳାନ୍ତୁ ନାହିଁ। | APPROVED |

---

## 6. PDF Generation Localization (Module 05)
For downloadable clinical summaries:
- The backend uses ReportLab with registered TrueType Unicode fonts:
  - `NotoSansDevanagari-Regular.ttf` for Hindi sections.
  - `NotoSansOriya-Regular.ttf` for Odia sections.
- When generating a PDF in Hindi or Odia, the document renders bilingual headers (English medical code + Native script explanation) to ensure that the patient's consulting physician can seamlessly review the document regardless of their own native language.
