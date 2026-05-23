# Development Prompt

### Role
Act as an expert Front-End Web Developer, UI/UX Designer, and Gemini API integration mentor.

### Task
Create a clean, highly functional single-page Student Org Onboarding Portal with Gemini AI Assistance. The application must include:
* **Application Form with AI Field:** Input fields for Full Name, Email, and a text area for "Tell us about your skills, interests, or past experiences."
* **"Ask Gemini" Recommendation Button:** A button that sends the skills text to a simulated Gemini API function. The function must return an instant, tailored committee recommendation (e.g., Web Development, Marketing & Creatives, or Logistics).
* **Interactive Status Tracker:** A clean visual timeline showing the application stages (Applied → Screening → Interview → Onboarded) to prove a core flow works during the demo.
* **Member Onboarding Checklist:** A functional to-do list where accepted members can check off onboarding tasks, with visual strike-through states.

### Context
This project is for a student organization hackathon judged on solving a concrete internal problem (clunky onboarding), delivering a functional Minimum Viable Product (MVP), and demonstrating the meaningful integration of AI (Gemini).

### Constraints
* **Tech Stack:** Use only vanilla HTML5, CSS3, and JavaScript (ES6+). No heavy external frameworks.
* **AI Implementation:** Implement the AI logic within a clean JavaScript function called generateAIRecommendation(userInput). Use a clear, realistic asynchronous structure (async/await with setTimeout) to simulate a live Gemini API call fetch, ensuring the core flow runs flawlessly during a live demo.
* **Code Structure:** Separate the code into index.html, style.css, and script.js.
* **Code Readability:** Add straightforward comments explaining how the code handles the user data, feeds it to the simulated AI logic, and dynamically updates the DOM.

### Output Format
Return the response strictly formatted as follows:
1. **Rubric Alignment Checklist:** A short table showing how this code satisfies the Problem & Fit, AI Use, and Working MVP criteria.
2. **HTML Code:** Code block for index.html.
3. **CSS Code:** Code block for style.css.
4. **JavaScript Code:** Code block for script.js.
5. **Demo Execution Guide:** A quick 3-step guide on how to run a flawless live demo for the judges.

---

# Documentation Prompt

### Role
Act as a Technical Project Manager and Product Storyteller.

### Task
Write a comprehensive, beginner-friendly Technical Report and Pitch Documentation for the Student Org Onboarding Portal. This document must explicitly structure a compelling narrative that addresses every item in the hackathon judging rubrics, including a clear defense of the chosen technical stack.

### Context
The project was built using HTML, CSS, and JavaScript. It targets student leaders who need better operational workflows and judges who want to see a powerful narrative combined with meaningful technology.

### Constraints
* **Tone:** Professional, analytical, and narrative-driven (focusing on storytelling for the "Pitch" criteria).
* **Rubric Focus:** Heavily emphasize Problem & Fit (defining the specific user pain point), AI Use (explaining how Gemini makes the application smart), and Tech Stack Rationale (justifying the architecture choices for sustainability).
* **Length:** Keep sections crisp. Use structured bullet points (maximum 5 points per section) to keep it clear and highly readable.

### Output Format
Generate the documentation using the following Markdown structure:

# Hackathon Documentation: Project AutoBoard AI

## 1. Problem & Fit (Rubric Score: 25%)
* **Target User:** [Define the specific student org officer or applicant experiencing the problem]
* **The Core Pain Point:** [Explain the exact operational bottleneck in recruitment and onboarding]
* **The Solution Fit:** [How this digital portal solves that exact bottleneck cleanly]

## 2. Technical Stack Rationale (Problem & Fit & Pitch)
* **Why HTML5, CSS3, & Vanilla JavaScript?** * **Zero Setup Barrier:** Requires zero configuration, dependencies, or installation commands, making it immediately accessible for any student org officer to run locally.
  * **Lightweight Performance:** Without heavy external frameworks, the page loads instantly and runs smoothly during a high-stakes hackathon live demo.
  * **Long-Term Maintainability:** Vanilla web technologies ensure the codebase remains simple and readable for future generations of student developers to maintain.
* **Suggested Future Tech Stack (Scale & Simplicity):**
  * **Frontend:** *Tailwind CSS* — For faster, utility-first UI styling without writing custom CSS stylesheets.
  * **Backend & Database:** *Supabase / Firebase* — A beginner-friendly, low-code backend to securely store real-time applicant data and auth accounts without maintaining a dedicated server.
  * **Hosting:** *Vercel or GitHub Pages* — For free, instant global deployment straight from a code repository.

## 3. Meaningful AI Use Case (Rubric Score: 30%)
* **Gemini Integration Layer:** [Explain how the application uses AI to analyze student skills dynamically]
* **Value Add:** [Why standard hardcoded forms fail where Gemini succeeds in placing applicants]

## 4. Technical MVP Architecture (Rubric Score: 30%)
* **Structural Blueprint (`index.html`):** [Role of the layout elements in the core demo flow]
* **Aesthetics & Layout (`style.css`):** [How the visual interface remains premium yet clean]
* **State & Logic (`script.js`):** [How the status tracker and simulated asynchronous AI functions execute]

## 5. Pitch & Product Storytelling (Rubric Score: 15%)
* **The Hook:** [A powerful 1-2 sentence introduction opening for the live presentation pitch]
* **The Demo Narrative:** [A step-by-step walkthrough script for a 3-minute presentation that proves the MVP is fully functional]
