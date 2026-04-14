# Legitimacy Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace unverified marketing stats with qualitative claims and make Terms of Service / Privacy Policy publicly crawlable via dedicated routes.

**Architecture:** Two independent changes — (1) copy/data edits in existing landing section components, (2) new `/terms` and `/privacy` routes with standalone page components extracted from existing modal content, plus footer anchor tag replacements and sitemap additions.

**Tech Stack:** React + TypeScript (Vite), React Router v6, inline styles (no CSS modules), `client/public/sitemap.xml`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `client/src/components/landing/StatsSection.tsx` | Modify | Replace stats data array with qualitative tiles |
| `client/src/components/landing/TestimonialsSection.tsx` | Modify | Update subtitle string |
| `client/src/components/legal/TermsPage.tsx` | Create | Standalone public Terms of Service page |
| `client/src/components/legal/PrivacyPage.tsx` | Create | Standalone public Privacy Policy page |
| `client/src/App.tsx` | Modify | Add `/terms` and `/privacy` routes |
| `client/src/components/landing/FooterSection.tsx` | Modify | Replace modal buttons with `<a>` anchor tags, remove unused props |
| `client/src/components/landing/TosModal.tsx` | Modify | Remove `TosModal` and `PrivacyModal` exports; keep `LegalModal` |
| `client/public/sitemap.xml` | Modify | Add `/terms` and `/privacy` entries |

---

## Task 1: Replace stats with qualitative tiles in StatsSection

**Files:**
- Modify: `client/src/components/landing/StatsSection.tsx`

- [ ] **Step 1: Replace the STATS array**

Open `client/src/components/landing/StatsSection.tsx`. Replace lines 4–9:

```tsx
const STATS = [
  { value: `${templates.length}+`, label: 'Professional Templates' },
  { value: '50K+', label: 'Resumes Created' },
  { value: '98%', label: 'ATS Pass Rate' },
  { value: '3 min', label: 'Avg. time to first draft' },
];
```

With:

```tsx
const STATS = [
  { value: `${templates.length}+`, label: 'Professional Templates', sub: 'Classic to creative — a template for every role' },
  { value: 'ATS-Optimized', label: 'by Design', sub: 'Every template built to pass modern applicant tracking systems' },
  { value: 'AI-Powered', label: 'Writing', sub: 'Bullets, summaries and tailoring generated for your exact role' },
  { value: 'Interview-Ready', label: 'in Minutes', sub: 'From blank page to polished resume without the guesswork' },
];
```

- [ ] **Step 2: Update the tile renderer to show the `sub` line**

Replace the inner `<div>` block that renders each stat (lines 35–56) with:

```tsx
{STATS.map((stat, i) => (
  <div key={i} style={{
    flex: isMobile ? '1 0 50%' : 1,
    padding: isMobile ? '24px 16px' : '36px 24px',
    textAlign: 'center',
    borderRight: (!isMobile && i < STATS.length - 1) ? '1px solid var(--color-ui-border)' : 'none',
    borderBottom: (isMobile && i < STATS.length - 1) ? '1px solid var(--color-ui-border)' : 'none',
  }}>
    <div style={{
      fontSize: isMobile ? '20px' : '22px',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      marginBottom: '4px',
      color: 'var(--color-ui-text)',
    }}>
      {stat.value}
    </div>
    <div style={{ fontSize: isMobile ? '12px' : '13px', color: 'var(--color-ui-text-muted)', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '6px' }}>
      {stat.label}
    </div>
    <div style={{ fontSize: '11px', color: 'var(--color-ui-text-dim)', lineHeight: 1.5, maxWidth: '180px', margin: '0 auto' }}>
      {stat.sub}
    </div>
  </div>
))}
```

- [ ] **Step 3: Build to confirm no TypeScript errors**

```bash
cd client && npm run build 2>&1 | tail -20
```

Expected: no errors, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/landing/StatsSection.tsx
git commit -m "feat: replace unverified stats with qualitative positioning tiles"
```

---

## Task 2: Update testimonials subtitle

**Files:**
- Modify: `client/src/components/landing/TestimonialsSection.tsx`

- [ ] **Step 1: Update the subtitle**

In `client/src/components/landing/TestimonialsSection.tsx`, find line 132:

```tsx
Join 50,000+ professionals who've landed interviews with BespokeCV
```

Replace with:

```tsx
Trusted by job seekers across India
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/landing/TestimonialsSection.tsx
git commit -m "feat: remove unverified user count from testimonials subtitle"
```

---

## Task 3: Create TermsPage and PrivacyPage components

**Files:**
- Create: `client/src/components/legal/TermsPage.tsx`
- Create: `client/src/components/legal/PrivacyPage.tsx`

The legal content already exists in `TosModal.tsx`. These pages extract it into a standalone layout.

- [ ] **Step 1: Create `client/src/components/legal/TermsPage.tsx`**

```tsx
import React from 'react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const h2Style: React.CSSProperties = { fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '10px', marginTop: '28px' };
const pStyle: React.CSSProperties = { fontSize: '14px', color: '#94a3b8', lineHeight: 1.8, marginBottom: '14px' };
const lastUpdated: React.CSSProperties = { fontSize: '12px', color: '#64748b', marginBottom: '24px' };

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f5f9' }}>
              Bespoke<span style={{ color: '#818CF8' }}>CV</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{ fontSize: '13px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Content */}
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: '8px' }}>Terms of Service</h1>
        <p style={lastUpdated}>Last updated: April 1, 2026</p>
        <p style={pStyle}>Welcome to BespokeCV. By accessing or using our service, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.</p>

        <h2 style={h2Style}>1. Acceptance of Terms</h2>
        <p style={pStyle}>By creating an account or using BespokeCV in any way, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use our service. These Terms apply to all visitors, users, and others who access the service.</p>

        <h2 style={h2Style}>2. Description of Service</h2>
        <p style={pStyle}>BespokeCV provides an AI-powered resume building platform that enables users to create, edit, and export professional resumes. The service includes AI-generated content suggestions, template selection, ATS optimization tools, and PDF export functionality. We reserve the right to modify, suspend, or discontinue the service at any time with or without notice.</p>

        <h2 style={h2Style}>3. User Accounts and Responsibilities</h2>
        <p style={pStyle}>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information and to update it as necessary. You must not use the service for any unlawful purpose or in any way that could damage, disable, or impair the service.</p>

        <h2 style={h2Style}>4. Intellectual Property</h2>
        <p style={pStyle}>The BespokeCV platform, including its software, design, templates, and AI models, is the intellectual property of BespokeCV and its licensors. You retain ownership of the content you create using our service, including your resume data. By using the service, you grant BespokeCV a limited, non-exclusive license to process your content solely for the purpose of providing the service.</p>

        <h2 style={h2Style}>5. AI-Generated Content</h2>
        <p style={pStyle}>Our service uses AI models to generate suggestions, bullet points, summaries, and other content. While we strive to provide accurate and helpful suggestions, AI-generated content may contain errors or inaccuracies. You are solely responsible for reviewing and verifying all content before using it in professional contexts. BespokeCV makes no warranty regarding the accuracy, completeness, or fitness for purpose of AI-generated content.</p>

        <h2 style={h2Style}>6. Privacy and Data</h2>
        <p style={pStyle}>Your privacy is important to us. Please review our <a href="/privacy" style={{ color: '#818CF8' }}>Privacy Policy</a>, which describes how we collect, use, and share information about you when you use our service. By using BespokeCV, you agree to the collection and use of information as described in our Privacy Policy.</p>

        <h2 style={h2Style}>7. Disclaimer of Warranties</h2>
        <p style={pStyle}>The service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. BespokeCV does not warrant that the service will be uninterrupted, error-free, or completely secure.</p>

        <h2 style={h2Style}>8. Limitation of Liability</h2>
        <p style={pStyle}>To the fullest extent permitted by law, BespokeCV shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the service. Our total liability to you for any claims shall not exceed the amount you paid us in the twelve months preceding the claim.</p>

        <h2 style={h2Style}>9. Governing Law</h2>
        <p style={pStyle}>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in Delaware.</p>

        <h2 style={h2Style}>10. Changes to Terms</h2>
        <p style={pStyle}>We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the "last updated" date above. Your continued use of the service after such changes constitutes acceptance of the revised Terms. If you have questions about these Terms, please contact us at legal@bespokecv.in.</p>
      </div>
    </div>
  );
};

export default TermsPage;
```

- [ ] **Step 2: Create `client/src/components/legal/PrivacyPage.tsx`**

```tsx
import React from 'react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const h2Style: React.CSSProperties = { fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '10px', marginTop: '28px' };
const pStyle: React.CSSProperties = { fontSize: '14px', color: '#94a3b8', lineHeight: 1.8, marginBottom: '14px' };
const lastUpdated: React.CSSProperties = { fontSize: '12px', color: '#64748b', marginBottom: '24px' };

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f5f9' }}>
              Bespoke<span style={{ color: '#818CF8' }}>CV</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{ fontSize: '13px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Content */}
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={lastUpdated}>Last updated: April 1, 2026</p>
        <p style={pStyle}>At BespokeCV, we take your privacy seriously. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data.</p>

        <h2 style={h2Style}>1. Information We Collect</h2>
        <p style={pStyle}>We collect information you provide directly to us, including your resume data (name, work experience, education, skills), account credentials, and any feedback you send us. We also automatically collect usage data such as browser type, pages visited, and features used to help us improve the service.</p>

        <h2 style={h2Style}>2. How We Use Your Information</h2>
        <p style={pStyle}>We use your information to provide and improve the service, process AI-powered resume enhancements, generate PDFs, and communicate with you about your account. We do not sell your personal data to third parties. Resume data processed through AI features is not stored beyond the session unless you are a registered user with cloud save enabled.</p>

        <h2 style={h2Style}>3. Data Security</h2>
        <p style={pStyle}>We implement industry-standard security measures including TLS encryption for data in transit and AES-256 encryption for data at rest. We regularly review our security practices and update them as needed. Despite these measures, no system is completely secure, and we cannot guarantee absolute security.</p>

        <h2 style={h2Style}>4. Your Rights</h2>
        <p style={pStyle}>Depending on your jurisdiction, you may have rights to access, correct, delete, or port your data. To exercise these rights, contact us at privacy@bespokecv.in. We will respond to all requests within 30 days.</p>

        <h2 style={h2Style}>5. Contact</h2>
        <p style={pStyle}>For privacy-related questions, contact our Data Protection Officer at privacy@bespokecv.in or write to BespokeCV, Inc., 548 Market St, San Francisco, CA 94104.</p>
      </div>
    </div>
  );
};

export default PrivacyPage;
```

- [ ] **Step 3: Build to confirm no TypeScript errors**

```bash
cd client && npm run build 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/legal/TermsPage.tsx client/src/components/legal/PrivacyPage.tsx
git commit -m "feat: add standalone Terms and Privacy pages for SEO indexing"
```

---

## Task 4: Add /terms and /privacy routes to App.tsx

**Files:**
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Import the new page components**

At the top of `client/src/App.tsx`, after the existing lazy imports (around line 25), add:

```tsx
const TermsPage = lazy(() => import('./components/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./components/legal/PrivacyPage'));
```

- [ ] **Step 2: Add the routes**

In the `AppRoutes` function, inside `<Routes>`, after the `/blog` route (around line 527), add:

```tsx
<Route path="/terms" element={<TermsPage />} />
<Route path="/privacy" element={<PrivacyPage />} />
```

These are public routes — no `<ProtectedRoute>` wrapper.

- [ ] **Step 3: Build to confirm no TypeScript errors**

```bash
cd client && npm run build 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat: register /terms and /privacy as public routes"
```

---

## Task 5: Update footer to use anchor links instead of modal buttons

**Files:**
- Modify: `client/src/components/landing/FooterSection.tsx`

- [ ] **Step 1: Remove the `onOpenTos` and `onOpenPrivacy` props**

Replace the `Props` interface at the top of `FooterSection.tsx`:

```tsx
interface Props {
  onOpenTos: () => void;
  onOpenPrivacy: () => void;
  onOpenAbout: () => void;
  onOpenBlog: () => void;
  onOpenCareers: () => void;
  onOpenContact: () => void;
}
```

With:

```tsx
interface Props {
  onOpenAbout: () => void;
  onOpenBlog: () => void;
  onOpenCareers: () => void;
  onOpenContact: () => void;
}
```

And update the component signature from:

```tsx
const FooterSection: React.FC<Props> = ({ onOpenTos, onOpenPrivacy, onOpenAbout, onOpenBlog, onOpenCareers, onOpenContact }) => {
```

To:

```tsx
const FooterSection: React.FC<Props> = ({ onOpenAbout, onOpenBlog, onOpenCareers, onOpenContact }) => {
```

- [ ] **Step 2: Replace the Legal column buttons with anchor tags**

Find the Legal column (around lines 106–110):

```tsx
<button style={linkStyle} onClick={onOpenTos} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Terms of Service</button>
<button style={linkStyle} onClick={onOpenPrivacy} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Privacy Policy</button>
```

Replace with:

```tsx
<a href="/terms" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Terms of Service</a>
<a href="/privacy" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Privacy Policy</a>
```

- [ ] **Step 3: Build to confirm no TypeScript errors**

```bash
cd client && npm run build 2>&1 | tail -20
```

Expected: TypeScript will now flag callers of `FooterSection` that still pass `onOpenTos`/`onOpenPrivacy`. Fix those in the next step.

- [ ] **Step 4: Fix caller — LandingPage.tsx**

Find where `FooterSection` is used in `client/src/components/LandingPage.tsx`. Remove the `onOpenTos` and `onOpenPrivacy` props from the JSX and their associated state/handler declarations. Build again to confirm clean.

```bash
cd client && npm run build 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/landing/FooterSection.tsx client/src/components/LandingPage.tsx
git commit -m "feat: replace ToS/Privacy modal buttons with crawlable anchor links"
```

---

## Task 6: Clean up TosModal.tsx — remove unused modal exports

**Files:**
- Modify: `client/src/components/landing/TosModal.tsx`

- [ ] **Step 1: Check for any remaining usages of TosModal and PrivacyModal**

```bash
cd client && grep -r "TosModal\|PrivacyModal" src/ --include="*.tsx" --include="*.ts"
```

Expected: only `TosModal.tsx` itself appears (no imports elsewhere after Task 5).

- [ ] **Step 2: Remove TosModal and PrivacyModal exports**

In `client/src/components/landing/TosModal.tsx`, delete the `TosModal` component (lines 57–114) and the `PrivacyModal` component (lines 116–148) and the `export default TosModal` line (150).

Keep `LegalModal` and its supporting styles (`h2Style`, `pStyle`, `lastUpdated`) intact — `LegalModal` may be useful for future legal content modals.

The file after cleanup should only export `LegalModal`.

- [ ] **Step 3: Build to confirm no TypeScript errors**

```bash
cd client && npm run build 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/landing/TosModal.tsx
git commit -m "chore: remove unused TosModal and PrivacyModal exports"
```

---

## Task 7: Add /terms and /privacy to sitemap

**Files:**
- Modify: `client/public/sitemap.xml`

- [ ] **Step 1: Add the two new entries**

In `client/public/sitemap.xml`, after the last `</url>` block (before `</urlset>`), add:

```xml
  <url>
    <loc>https://bespokecv.in/terms</loc>
    <lastmod>2026-04-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://bespokecv.in/privacy</loc>
    <lastmod>2026-04-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
```

- [ ] **Step 2: Commit**

```bash
git add client/public/sitemap.xml
git commit -m "chore: add /terms and /privacy to sitemap for search engine indexing"
```

---

## Verification

- [ ] Run dev server: `cd client && npm run dev`
- [ ] Visit `http://localhost:5173` — stats section shows qualitative tiles with no numbers except template count
- [ ] Testimonials subtitle reads "Trusted by job seekers across India"
- [ ] Footer Legal column: clicking "Terms of Service" navigates to `/terms` (not a modal)
- [ ] Footer Legal column: clicking "Privacy Policy" navigates to `/privacy` (not a modal)
- [ ] `http://localhost:5173/terms` loads without auth redirect, content is visible
- [ ] `http://localhost:5173/privacy` loads without auth redirect, content is visible
- [ ] `http://localhost:5173/terms` — "Privacy Policy" link inside section 6 navigates to `/privacy`
- [ ] `client/public/sitemap.xml` contains both new entries
