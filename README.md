# Development Prompt

### Role
Act as an expert Full-Stack Web Developer, UI/UX Designer, and Gemini API integration mentor.

### Task
Create a modern, highly functional single-page Student Org Onboarding Portal called **OrgaLink AI**. The application must feature:
* **Application Form with File Upload & Live RAG Search:** Input fields for Full Name, Email, and a file input field allowing users to upload their resume, bio, or portfolioguidelines text file (`.txt`).
* **"Analyze with Gemini File Search" Button:** Clicking this button runs backend logic matching the exact implementation provided by our workshop speaker. It initializes a `file_search_store`, uploads the uploaded text file, and calls the `gemini-3-flash-preview` model equipped with `types.FileSearch()` to run a live Retrieval-Augmented Generation (RAG) process. It looks into the document text and prints an accurate committee placement result (e.g., Web Development, Marketing & Creatives, or Logistics).
* **Interactive Status Tracker:** A responsive visual timeline showing the recruitment lifecycle phases (Applied → Screening → Interview → Onboarded) to show active flow states.
* **Member Onboarding Checklist:** An interactive checklist component where accepted members can complete tasks, updating with distinct struck-through states upon checkbox toggles.

### Context
This project is for a student organization hackathon focused on advanced AI integration. By using the new Google GenAI SDK File Search tool, the application moves beyond standard prompts and executes contextual search over internal files to dramatically optimize the onboarding and filtering experience.

### Constraints
* **Tech Stack:** Use HTML5, CSS3, and clean JavaScript (ES6+). No heavy client-side frameworks. 
* **Mobile-First Responsiveness:** The design must be completely fluid, responsive, and mobile-friendly. Use a flexible CSS layout (Flexbox or CSS Grid) with a modern breakpoint hierarchy so it scales perfectly across desktop layouts, tablets, and small smartphone viewports without content clipping.
* **AI Implementation Integration:** Wire up the UI event listener to a clean function reflecting the exact structural steps of the speaker's Python backend block:
  1. `client.file_search_stores.create()`
  2. `client.file_search_stores.upload_to_file_search_store()`
  3. `client.models.generate_content(model="gemini-3-flash-preview", tools=[types.Tool(file_search=types.FileSearch(...))])`
* **Code Structure & Comments:** Separate your project into `index.html`, `style.css`, and `script.js`. Write clear, beginner-friendly comments explaining how the file data is captured from the input element, routed to the RAG tool implementation, and rendered into the viewport.

### Output Format
Return the response strictly formatted as follows:
1. **Rubric Alignment Checklist:** A short table showing how this code satisfies the Problem & Fit, Advanced AI RAG Use, and Working MVP criteria.
2. **HTML Code:** Complete production code block for `index.html`.
3. **CSS Code:** Mobile-responsive code block for `style.css`.
4. **JavaScript Code:** Interactive backend/frontend handling block for `script.js`.
5. **Demo Execution Guide:** A quick 3-step guide on how to run a flawless live demo for the judges.

---

# Documentation Prompt

### Role
Act as a Technical Project Manager and Product Storyteller.

### Task
Write a comprehensive, beginner-friendly Technical Report and Pitch Documentation for the Student Org Onboarding Portal. This document must explicitly structure a compelling narrative that addresses every item in the hackathon judging rubrics, highlighting our technical architecture decisions, mobile adaptability, and RAG implementation.

### Context
The project was built using HTML, CSS, and JavaScript. It targets student leaders who need better operational workflows and judges who want to see a powerful narrative combined with production-ready AI tools.

### Constraints
* **Tone:** Professional, analytical, and narrative-driven (focusing on storytelling for the "Pitch" criteria).
* **Rubric Focus:** Heavily emphasize Problem & Fit (defining the specific user pain point), Advanced AI RAG Use (explaining how Gemini File Search handles contextual indexing), Mobile Accessibility, and Tech Stack Rationale.
* **Length:** Keep sections crisp. Use structured bullet points (maximum 5 points per section) to keep it clear and highly readable.

### Output Format
Generate the documentation using the following Markdown structure:

# Hackathon Documentation: Project OrgaLink AI

## 1. Problem & Fit (Rubric Score: 25%)
* **Target User:** [Define the specific student org officer or applicant experiencing the problem]
* **The Core Pain Point:** [Explain the exact operational bottleneck in recruitment and manual file sorting]
* **The Solution Fit:** [How this digital portal solves that exact bottleneck cleanly]

## 2. Technical Stack & Mobile-First Rationale
* **Why HTML5, CSS3, & Vanilla JavaScript?** * **Zero Setup Barrier:** Requires zero configuration, dependencies, or installation commands, making it immediately accessible for any student org officer to run locally.
  * **Lightweight Performance:** Without heavy external frameworks, the page loads instantly and runs smoothly during a high-stakes hackathon live demo.
  * **Long-Term Maintainability:** Vanilla web technologies ensure the codebase remains simple and readable for future generations of student developers to maintain.
* **Mobile-Responsive Optimization:**
  * **Fluid Layouts:** Uses relative scaling units and flexible layouts to guarantee a premium interface experience on both desktop screens and mobile mobile devices.
  * **Touch-Friendly Controls:** Adapts form targets, buttons, and tracker workflows for painless interactivity on mobile viewports.
* **Suggested Future Tech Stack (Scale & Simplicity):**
  * **Frontend:** *Tailwind CSS* — For faster, utility-first UI styling without writing custom CSS stylesheets.
  * **Backend & Database:** *Supabase / Firebase* — A beginner-friendly backend to securely store real-time applicant data and session authentication state.

## 3. Meaningful AI Use Case & File Search RAG 
* **Gemini Retrieval-Augmented Generation (RAG):**
  * **File Store Upload Pipeline:** Integrates custom text chunking and indexing mechanisms mimicking the speaker's Python backend flow to upload student files straight to `client.file_search_stores`.
  * **Contextual Evaluation Tool:** Passes uploaded documents into `types.FileSearch()` alongside the `gemini-3-flash-preview` model, ensuring semantic parsing over manual student history.
* **Value Add:** [Why standard hardcoded forms fail where Gemini succeeds in placing applicants]

## 4. Technical MVP Architecture
* **Structural Blueprint (`index.html`):** [Role of the layout elements in the core demo flow]
* **Aesthetics & Layout (`style.css`):** [How the visual interface remains premium yet clean]
* **State & Logic (`script.js`):** [How the status tracker and simulated asynchronous AI functions execute]

## 5. Pitch & Product Storytelling
* **The Hook:** [A powerful 1-2 sentence introduction opening for the live presentation pitch]
* **The Demo Narrative:** [A step-by-step walkthrough script for a 3-minute presentation that proves the MVP is fully functional]
