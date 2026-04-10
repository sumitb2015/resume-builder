# Implementation Plan: Premium Features Expansion

This plan outlines the steps to implement three high-value features: Cover Letter Generator, AI Interview Prep, and Human-in-the-Loop Expert Review.

## 1. Backend: AI Service & Routes Expansion

### 1.1 Update `server/src/services/ai.service.ts`
- Implement `generateCoverLetter(resumeData, jobDescription)`:
  - Prompt: Focus on connecting resume achievements to specific JD requirements. Use a professional, persuasive tone.
  - Returns: A string (HTML or Markdown).
- Implement `generateInterviewPrep(resumeData, jobDescription)`:
  - Prompt: Identify potential gaps or "tough" questions based on the resume vs JD. Provide 5-8 questions with structured "Best way to answer" advice.
  - Returns: JSON object with questions and suggested answers.

### 1.2 Update `server/src/index.ts`
- Add new POST endpoints:
  - `/api/ai/generate-cover-letter`
  - `/api/ai/generate-interview-prep`
- Add Zod validation for the new endpoints.

### 1.3 Update `server/src/routes/user.routes.ts`
- Add `POST /api/user/request-review`:
  - Payload: `{ userId, resumeId, resumeData, comments }`.
  - Logic: Save the request to a Firestore collection named `expert_reviews` with status `pending`.

## 2. Frontend: API & State Management

### 2.1 Update `client/src/lib/api.ts`
- Add methods:
  - `generateCoverLetter(resume, jobDescription)`
  - `generateInterviewPrep(resume, jobDescription)`
  - `requestExpertReview(userId, resumeId, resumeData, comments)`

### 2.2 Update `client/src/App.tsx`
- Add new view states: `'cover-letter'` and `'interview-prep'`.
- Update `FEATURE_REQUIRED_PLAN` to include:
  - `cover-letter`: `'pro'`
  - `interview-prep`: `'ultimate'`
  - `expert-review`: `'ultimate'` (or as a separate paid add-on, but for now we'll put it in Ultimate).
- Add new navigation tabs in the top bar.
- Add state for `showExpertReviewModal`.

## 3. New UI Components

### 3.1 `client/src/components/CoverLetterPage.tsx`
- Wizard-style flow (similar to `JobTailorPage`):
  - Step 1: Select Resume (Current vs Upload).
  - Step 2: Paste JD / Fetch URL.
  - Step 3: View Generated Cover Letter with "Copy to Clipboard" and "Download as PDF" buttons.

### 3.2 `client/src/components/InterviewPrepPage.tsx`
- Flow:
  - Step 1 & 2: Same as above (Resume + JD).
  - Step 3: Interactive list of questions and accordion-style "Suggested Answers".

### 3.3 `client/src/components/ExpertReviewModal.tsx`
- Form modal:
  - Textarea for specific questions/concerns for the expert.
  - "Submit Request" button.
  - Success state: "Your request has been submitted. An expert will get back to you within 48 hours."

## 4. Verification Plan

### 4.1 Automated Tests
- Add unit tests for the new prompt functions in `server/src/services/ai.service.test.ts` (if it exists, or create a new one).
- Test Zod validation for new endpoints.

### 4.2 Manual Verification
- **Cover Letter:** Generate a cover letter for a specific job and verify it intelligently uses resume data.
- **Interview Prep:** Verify the generated questions are relevant to both the resume and the JD.
- **Expert Review:** Submit a request and verify it appears in the `expert_reviews` Firestore collection.
- **Navigation:** Ensure the new tabs only appear for users on the correct plan (Pro/Ultimate).
