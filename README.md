# TaalTalent — Smart Job Application Tracker & Recruitment Scam Protection
> **Automation Track: Job Hunt Autopilot** — *Track every application. Catch every fake offer.*

An AI-powered web application built for laid-off professionals and active job seekers managing 100+ job applications. TaalTalent ingests a sample inbox of recruitment emails, extracts application statuses (Applied, Assessment, Interview, Offer, Rejected), flags advance-fee and identity-theft scams in red with quoted evidence, provides role-based access for candidate submissions & admin approvals, and triggers automated follow-up reminders after 7 days of no reply.

---

## 🌟 Key Highlights & Capabilities

### 1. One Unified Autonomous Pipeline
- **Continuous Application Deduplication**: Recruiter emails across different dates (e.g. application acknowledgement, phone screen, technical loop, offer letter) are merged into the same application record without creating duplicates or downgrading status.
- **Statuses**: `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`, `No Response`.
- **Kanban & Table Views**: Easily switch between an interactive Kanban board and a sortable data table with CSV export.

### 2. Built-in Scam Protection & Fraud Defense
- **Heuristic & LLM-Driven Fraud Analysis**:
  - **Advance-Fee Job Scams**: Detection of registration fees, training deposits, and software licensing fees ($250 deposit via Zelle/Bitcoin).
  - **Credential & Phishing Threats**: Flags requests for online banking passwords, temporary SMS OTPs, and Western Union payments.
  - **Suspicious Recruiter Behaviors**: Flags guaranteed selection without interview and unmonitored Telegram/WhatsApp recruiter chat channels.
  - **False Positive Guardrail**: Contextually validates legitimate employers requesting standard background documentation (e.g., via accredited portals like HireRight/DocuSign).
- **Candidate Safety Actions**: Plain-language risk rationale (bilingual EN/HI), exact evidence quoted from email bodies, and user correction controls (*Mark as Reviewed*, *Report as Suspicious*, *Mark as Not a Scam*).

### 3. Automated 7-Day Follow-Up Reminders
- **Core 7-Day Rule**: If an application has no meaningful recruiter response after 7 days, JobShield automatically generates a tailored follow-up reminder.
- **Categorization**: *Overdue* (>8 days), *Due Today* (7-8 days), *Upcoming* (<7 days), *Completed*, and *Dismissed*.
- **Pre-Composed Polite Follow-up Emails**: Ready-to-copy follow-up messages in both English and Hindi.
- **Snooze Options**: Snooze reminders for 1, 3, or 7 days.

### 4. Bilingual Support (English & हिन्दी)
- Instant language toggle in the top bar without reloading the page.
- Comprehensive localization across all navigation, KPI metrics, buttons, status badges, email classifications, scam explanations, follow-up messages, notifications, and settings.

### 5. Privacy & Zero-Credential Architecture
- **No Gmail/Outlook OAuth Required**: Ingest emails via built-in 20-email realistic dataset, JSON file upload, `.mbox` file upload, or by pasting custom text.
- **Local Persistence**: Data persists in browser `localStorage`.
- **Hybrid AI Engine**: Works 100% offline using deterministic rule heuristics, with optional live Google Gemini API integration configured via Settings.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run Locally
```bash
# Clone or navigate to the directory
cd c:/garbathon

# Install dependencies
npm install

# Start development server
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🎬 1-Minute Demonstration Walkthrough

1. **Open the Application**: The dashboard loads with 6 dynamic KPI cards (Total Applications, Awaiting Response, Interviews, Offers, Rejections, Scams Detected) and Recharts distribution charts.
2. **Review the Layoff Autopilot Story**: Notice the green badge and story banner dedicated to candidates tracking high-volume applications after layoffs.
3. **Run Batch AI Analysis**:
   - Click **"Analyse Emails"** in the sidebar or top banner.
   - Watch the 4-stage transparent progress modal (*Reading email headers → Fraud detection → Application pipeline extraction → 7-day reminder scheduling*).
4. **Explore the Email Inbox**:
   - Filter by classification (e.g. *Interview Invitation*, *Potential Scam*, *Job Offer*).
   - Click an email to inspect the split pane reader.
   - Toggle between **Original Email** (suspicious phrases highlighted in red/yellow) and **AI Analysis & Extraction** (risk score meter, reasons, quoted evidence, recommended next steps).
5. **Inspect Scam Protection**:
   - Navigate to **Scam Protection** via sidebar.
   - Observe the high-risk scams (*Apex Global* demanding $250 software fee, *Vertex Talent* demanding bank login/OTP).
   - Test candidate feedback (*Mark as Reviewed*, *Report Suspicious*, or *Not a Scam*).
6. **Check Follow-Up Reminders**:
   - Navigate to **Follow-up Reminders**.
   - Review overdue applications (e.g., Figma 16 days ago, Google 22 days ago).
   - Click **"Copy"** to copy the polite follow-up email template, or test **Snooze 3 Days**.
   - Switch template language between English and हिन्दी.
7. **Test Bilingual Toggle**:
   - Click the **EN / हिन्दी** toggle in the top bar.
   - Verify the entire dashboard, navigation, and badges seamlessly render in Hindi.
8. **Test Kanban & Table Views**:
   - Navigate to **Application Tracker**.
   - Toggle between **Table View** and **Kanban Board**.
   - Click any card to open the **Application Details Modal** with timeline history and linked email chain.
   - Test **Export CSV**.

---

## 📁 Project Structure

```
garbathon/
├── public/
│   ├── sample_inbox.json       # Downloadable 20-email starter dataset
│   ├── shield.svg              # Favicon SVG
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.tsx       # Status, Risk, and Reminder badges
│   │   │   └── ToastContainer.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Top bar, search, language toggle, notifications
│   │   │   └── Sidebar.tsx     # 7 navigation modules & AI status
│   │   ├── modals/
│   │   │   ├── AddEditApplicationModal.tsx
│   │   │   ├── ApplicationDetailModal.tsx
│   │   │   ├── AnalysisProgressModal.tsx
│   │   │   └── PasteEmailModal.tsx
│   │   └── pages/
│   │       ├── AnalyticsPage.tsx      # Recharts funnel & response velocity
│   │       ├── InboxPage.tsx          # Split-pane email reader & fraud highlighter
│   │       ├── OverviewPage.tsx       # KPI cards, charts & quick actions
│   │       ├── RemindersPage.tsx      # 7-day rule engine & bilingual templates
│   │       ├── ScamProtectionPage.tsx # Fraud defense & user verification
│   │       ├── SettingsPage.tsx       # Gemini API key, backup/restore, privacy
│   │       └── TrackerPage.tsx        # Table & Kanban pipeline manager
│   ├── context/
│   │   └── AppContext.tsx      # Central reactive store & persistence
│   ├── data/
│   │   └── sampleEmails.ts     # 20 realistic fictional recruitment emails
│   ├── locales/
│   │   └── translations.ts     # Bilingual dictionary (English & Hindi)
│   ├── services/
│   │   ├── aiService.ts        # Gemini LLM + local heuristic analysis
│   │   └── emailProcessor.ts   # Deduplication, 7-day reminders & alerts
│   ├── types/
│   │   └── index.ts            # TypeScript data contracts
│   ├── App.tsx                 # Root layout & view controller
│   ├── main.tsx
│   └── index.css               # Tailwind directives & sleek styling
├── tailwind.config.js
├── tsconfig.app.json
├── vite.config.ts
└── package.json
```

---

## 🛡️ Ethical AI & Privacy Disclosure
- **Privacy First**: JobShield AI never accesses your Gmail/Outlook account directly. No passwords or tokens are transmitted to external servers.
- **Transparent Evidence**: Fraud flags always include explicit quoted phrases and plain-language reasoning.
- **Verification Rule**: AI identifies potential indicators; candidates are always reminded to verify recruiters via official corporate channels.
