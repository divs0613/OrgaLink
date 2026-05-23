# Hackathon Documentation: Project OrgaLink AI (Multi-Page Recruiting System)

## 1. Problem & Fit
* **Target User:** Student organization recruitment officers (e.g., Executive Board members, Committee Chairs of JPCS-APC) and student applicants seeking matching roles.
* **The Core Pain Point:** Managing student recruiting portfolios is chaotic. Freeform resume text is difficult to filter manually, and student profiles must be evaluated, approved, and tracked. Additionally, onboarding checklists (e.g., signing codes of conduct, joining communication channels) must remain strictly locked for vetted, officially approved candidates rather than general applicants.
* **The Solution Fit:** OrgaLink AI streamlines this pipeline using a multi-page recruitment application. It allows candidates to submit applications alongside PDF, DOCX, or TXT portfolios. The portal reads and parses documents client-side, runs a mock Gemini File Search RAG classification, and saves them to a database. Administrators can review all applicants in a dedicated portal and approve candidates, which instantly unlocks the onboarding checklist on the candidate's personal lookup tracker page.

## 2. Technical Stack & Mobile-First Rationale
* **Why HTML5, CSS3, & Vanilla JavaScript?**
  * **Zero Setup Barrier:** Bypasses local server configurations, compilation scripts, or database setups by running entirely client-side. The app works straight out of the box in any browser.
  * **Lightweight Performance:** Without bulky framework overheads (like React or Angular), views load instantly, and interactions are snappy—ideal for high-stakes, fast-paced hackathon presentations.
  * **Persistent Local Database:** Employs browser `localStorage` as a mock candidate database. This allows real-time applicant indexing and state updates to sync smoothly across separate portals.
* **Mobile-Responsive Optimization:**
  * **Fluid Layouts:** Uses CSS Grid (with `form-row-2` dynamic columns) and Flexbox alignment rules. The design scales automatically from dual-column widescreen desktops to single-column phone screens without text clipping.
  * **Touch-Optimized Elements:** Standardizes button touch targets, drag-and-drop upload borders, table grids, and checklist check boxes to facilitate easy navigation on tablets and mobile phones.
* **Suggested Future Tech Stack (Scale & Simplicity):**
  * **Frontend:** *Tailwind CSS* — For rapid utility-first styles and unified brand themes.
  * **Backend & Database:** *Supabase / PostgreSQL* — A real-time cloud database to replace LocalStorage, securing logins and ensuring multi-device synchronizations.

## 3. Meaningful AI Use Case & File Search RAG
* **Gemini Retrieval-Augmented Generation (RAG):**
  * **Client-Side Document Readers:** Integrates PDF.js (to parse and assemble string characters from PDF page streams) and Mammoth.js (to convert raw DOCX binary buffers into raw text strings).
  * **Vector RAG Simulation:** Demonstrates the exact Python Gemini SDK File Search API structure (`file_search_stores.create()`, `upload_to_file_search_store()`, and `generate_content` using `types.FileSearch(...)`) inside a live terminal log screen to show judges how the AI digests unstructured files.
* **Value Add:** Traditional checkboxes limit applicants to rigid choices. Gemini’s File Search RAG reads between the lines of a student's resume (e.g., detecting keywords like "Photoshop" or "Figma" to classify them into the Marketing & Creatives committee), matching them contextually to where they fit best.

## 4. Technical MVP Architecture
* **Structural Blueprint (Three-Page Portal):**
  * **[index.html](file:///Users/gargallograce/JPCS-APC/index.html) (Registration & Vetting):** Features candidate forms with input fields (Student number, Phone, Year level, Course), a drag-and-drop file upload zone (TXT/PDF/DOCX), a live RAG SDK execution console, and a **Committee Roles Directory** detail at the bottom listing available jobs.
  * **[tracker.html](file:///Users/gargallograce/JPCS-APC/tracker.html) (Student Lookup):** Allows candidates to search for their profiles by email. Renders a refined 3-step status timeline (Applied ➔ Interview ➔ Approved). Unlocks the onboarding checklist widget *only* after approval.
  * **[officer.html](file:///Users/gargallograce/JPCS-APC/officer.html) (Admin Dashboard):** Secure officer entrance (`admin@gmail.com` / `admin123`). Displays metrics (Total candidates, Interview status, Approved count), candidate distribution counters for each committee, custom sorting/filtering, and detailed evaluation profiles.
* **Aesthetics & Layout (`style.css`):** Formulates an premium, immersive dark-mode workspace utilizing frosted glass containers (glassmorphism), neon violet-to-blue accents, glowing vector overlays, and a grid responsive breakpoint hierarchy.
* **State & Logic (`script.js`, `tracker.js`, `officer.js`):** Syncs registration payloads, handles browser file buffer extractions, monitors progress percentages, and updates candidate status flags.

## 5. Pitch & Product Storytelling
* **The Hook:** "Every semester, student orgs lose weeks sorting through applicant files, while candidates are left in the dark about their status. OrgaLink AI changes this—combining automated Gemini File Search RAG classification with a real-time status tracker and approval-locked onboarding checkpoints."
* **The Demo Narrative:**
  1. **Step 1 (Apply):** Open `index.html`. Review the Available Committee Positions list at the bottom. Fill in the form. Upload `sample_developer.pdf` and click "Analyze". Show the judges the console executing the Python GenAI client calls.
  2. **Step 2 (Lookup - Locked state):** Go to `tracker.html` and search for the registered email. Point out that the timeline shows "Applied" status (Screening is completed automatically under the hood), and the Onboarding Checklist is securely locked.
  3. **Step 3 (Admin Portal):** Go to `officer.html`. Log in using `admin@gmail.com` / `admin123`. Show the dashboard listing candidates. Demonstrate sorting by name or match score, and filtering by status. Point out the committee counts. Show that we can move a candidate to the "Interview" stage or "Approve" them instantly using the separate action buttons.
  4. **Step 4 (Complete Onboarding):** Go back to `tracker.html` and search the email again. Show that the status timeline has updated to "Approved", and the checklist has unlocked. Check tasks to see the progress bar fill up in real time!
