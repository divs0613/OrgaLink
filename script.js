/**
 * OrgaLink AI Onboarding Portal - Index Logic
 * Implements:
 * 1. Text extraction from .txt, .pdf, and .docx files client-side.
 * 2. Simulated Google GenAI SDK Python backend console display.
 * 3. Keyword matching to assign applicant committee placements.
 * 4. LocalStorage syncing to allow cross-page tracking and administration.
 */

// Configure PDFJS Worker
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const form = document.getElementById('rag-application-form');
  const fileInput = document.getElementById('file-upload');
  const dropZone = document.getElementById('drop-zone');
  const fileInfoBadge = document.getElementById('file-info-badge');
  const fileNameText = document.getElementById('file-name-text');
  const removeFileBtn = document.getElementById('remove-file-btn');
  const submitBtn = document.getElementById('submit-rag-btn');
  const sdkTerminal = document.getElementById('sdk-terminal');
  const analysisResults = document.getElementById('analysis-results');
  const placementCommittee = document.getElementById('placement-committee');
  const matchScore = document.getElementById('match-score');
  const analysisReasoning = document.getElementById('analysis-reasoning');

  // Input Fields
  const fullNameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email-address');
  const studentNumInput = document.getElementById('student-number');
  const contactNumInput = document.getElementById('contact-number');
  const yearLevelSelect = document.getElementById('year-level');
  const courseMajorSelect = document.getElementById('course-major');

  // App State
  let uploadedFileContent = "";
  let uploadedFileName = "";
  let isAnalyzing = false;

  /* ----------------------------------------------------
     FILE DRAG-AND-DROP AND CHANGED EVENT LISTENERS
     ---------------------------------------------------- */
  dropZone.addEventListener('click', (e) => {
    if (e.target.closest('#remove-file-btn') || e.target.closest('.file-badge')) return;
    fileInput.click();
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetFileUpload();
  });

  /* ----------------------------------------------------
     CLIENT-SIDE MULTI-FORMAT FILE PARSERS
     ---------------------------------------------------- */
  async function handleFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    uploadedFileName = file.name;
    
    if (ext !== 'txt' && ext !== 'pdf' && ext !== 'docx') {
      alert("Unsupported file format! Please upload only .txt, .pdf, or .docx files.");
      resetFileUpload();
      return;
    }

    logToTerminal(`System: Loading file "${file.name}"...`, 'progress-msg');

    const reader = new FileReader();

    if (ext === 'txt') {
      reader.onload = (e) => {
        uploadedFileContent = e.target.result;
        showFileBadge(file.name, file.size);
        logToTerminal("System: [SUCCESS] Plain text (.txt) file loaded into memory.", "success-msg");
      };
      reader.readAsText(file);
    } 
    else if (ext === 'pdf') {
      reader.onload = async (e) => {
        try {
          const buffer = e.target.result;
          logToTerminal("PDF.js: Initializing document loading pipeline...", "code-call");
          
          const loadingTask = pdfjsLib.getDocument({ data: buffer });
          const pdf = await loadingTask.promise;
          let extractedText = "";

          logToTerminal(`PDF.js: Document parsed. Pages found: ${pdf.numPages}. Extracting strings...`, "progress-msg");
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            extractedText += pageText + "\n";
          }

          uploadedFileContent = extractedText;
          showFileBadge(file.name, file.size);
          logToTerminal("System: [SUCCESS] PDF document text parsed successfully.", "success-msg");
        } catch (err) {
          logToTerminal(`PDF.js Error: Failed to parse PDF file. ${err.message}`, "error-msg");
          alert("Error parsing PDF file. Please ensure it is not password-protected.");
          resetFileUpload();
        }
      };
      reader.readAsArrayBuffer(file);
    } 
    else if (ext === 'docx') {
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          logToTerminal("Mammoth.js: Initializing word document conversion...", "code-call");
          
          const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
          uploadedFileContent = result.value;
          
          showFileBadge(file.name, file.size);
          logToTerminal("System: [SUCCESS] DOCX text content extracted successfully.", "success-msg");
        } catch (err) {
          logToTerminal(`Mammoth.js Error: Failed to convert DOCX file. ${err.message}`, "error-msg");
          alert("Error parsing DOCX file. Please upload a standard Word document.");
          resetFileUpload();
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  function showFileBadge(name, size) {
    fileNameText.textContent = `${name} (${formatBytes(size)})`;
    fileInfoBadge.classList.remove('hidden');
  }

  function resetFileUpload() {
    fileInput.value = '';
    uploadedFileContent = '';
    uploadedFileName = '';
    fileInfoBadge.classList.add('hidden');
    logToTerminal("System: Uploaded file cache cleared.", 'system-msg');
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /* ----------------------------------------------------
     TERMINAL LOG SYSTEM
     ---------------------------------------------------- */
  function logToTerminal(message, type = 'code-call') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    if (type === 'cmd-prompt') {
      line.innerHTML = `<span>&gt;&gt;&gt; </span>${message}`;
    } else {
      line.textContent = message;
    }
    sdkTerminal.appendChild(line);
    sdkTerminal.scrollTop = sdkTerminal.scrollHeight;
  }

  function clearTerminal() {
    sdkTerminal.innerHTML = '';
  }

  /* ----------------------------------------------------
     KEYWORD PLACEMENT EVALUATION
     ---------------------------------------------------- */
  function evaluateSkills(content) {
    const text = content.toLowerCase();
    const keywords = {
      'Web Development': ['html', 'css', 'javascript', 'react', 'next', 'node', 'coding', 'programming', 'web', 'python', 'git', 'backend', 'frontend', 'developer', 'fullstack', 'database', 'sql'],
      'Marketing & Creatives': ['design', 'photoshop', 'illustrator', 'figma', 'social media', 'marketing', 'creative', 'video', 'graphics', 'ui/ux', 'content', 'branding', 'copywriting', 'seo', 'art', 'editing'],
      'Logistics': ['event', 'logistic', 'planning', 'schedule', 'coordination', 'finance', 'budget', 'sponsor', 'operation', 'management', 'organize', 'liaison', 'operations', 'meetings', 'excel']
    };

    let counts = {
      'Web Development': 0,
      'Marketing & Creatives': 0,
      'Logistics': 0
    };

    for (const [committee, words] of Object.entries(keywords)) {
      words.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          counts[committee] += matches.length;
        }
      });
    }

    let matchedCommittee = 'Marketing & Creatives';
    let highestCount = 0;

    for (const [committee, count] of Object.entries(counts)) {
      if (count > highestCount) {
        highestCount = count;
        matchedCommittee = committee;
      }
    }

    let matchPct = 75 + Math.min(highestCount * 4, 23);
    
    let reasoning = "";
    if (matchedCommittee === 'Web Development') {
      reasoning = "Gemini File Search parsed key phrases related to engineering, system tools, and development frameworks. The applicant demonstrates strong technical foundation and is recommended for the engineering squad to manage web applications and databases.";
    } else if (matchedCommittee === 'Marketing & Creatives') {
      reasoning = "Gemini File Search matched UI/UX design components, artistic workflows, and branding keywords. The applicant displays creative aesthetic focus suitable for spearheading promotions, asset designs, and social media campaigns.";
    } else {
      reasoning = "Gemini File Search extracted high instances of event management, timeline configurations, scheduling, and strategic coordination keywords. Ideal fit for organizing hackathons, operations, budgets, and external collaborations.";
    }

    return {
      committee: matchedCommittee,
      score: `${matchPct}%`,
      reasoning: reasoning
    };
  }

  /* ----------------------------------------------------
     SIMULATED GEMINI SDK FILE SEARCH RAG PIPELINE
     ---------------------------------------------------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!uploadedFileContent.trim()) {
      alert("Please upload a text, PDF, or Word document containing your resume or skills description.");
      return;
    }

    if (isAnalyzing) return;
    isAnalyzing = true;

    // UI Updates
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Gemini Vetting in Progress...</span>';
    analysisResults.classList.add('hidden');
    clearTerminal();

    const delay = ms => new Promise(res => setTimeout(res, ms));

    try {
      // Step 1: Initializing GenAI Client
      logToTerminal("System: Invoking Google GenAI Client...", "system-msg");
      await delay(800);
      logToTerminal("from google import genai", "cmd-prompt");
      logToTerminal("from google.genai import types", "cmd-prompt");
      logToTerminal("client = genai.Client()", "cmd-prompt");
      await delay(700);

      // Step 2: Creating File Search Store
      logToTerminal("# Phase 1: Initializing Gemini File Search Store", "system-msg");
      logToTerminal("store = client.file_search_stores.create(", "cmd-prompt");
      logToTerminal("    display_name=\"orgalink_vetting_store\"", "code-call");
      logToTerminal(")", "code-call");
      await delay(1000);
      logToTerminal("System: [SUCCESS] file_search_store created with ID: fss_8d3b9e4a", "success-msg");
      await delay(500);

      // Step 3: Uploading document to file search store
      logToTerminal("# Phase 2: Indexing file into RAG cache", "system-msg");
      logToTerminal("file_ref = client.file_search_stores.upload_to_file_search_store(", "cmd-prompt");
      logToTerminal("    store_id=\"fss_8d3b9e4a\",", "code-call");
      logToTerminal(`    file="${uploadedFileName}"`, "code-call");
      logToTerminal(")", "code-call");
      logToTerminal("System: Parsing document structure, computing token maps...", "progress-msg");
      await delay(1200);
      logToTerminal("System: [SUCCESS] File vectorized. 1 doc added to store index.", "success-msg");
      await delay(600);

      // Step 4: Run Gemini model with tool enabled
      logToTerminal("# Phase 3: Executing contextual query over index using gemini-3-flash-preview", "system-msg");
      logToTerminal("prompt = \"Analyze the applicant profile and assign a committee: Web Development, Marketing & Creatives, or Logistics. Explain why.\"", "cmd-prompt");
      logToTerminal("response = client.models.generate_content(", "cmd-prompt");
      logToTerminal("    model=\"gemini-3-flash-preview\",", "code-call");
      logToTerminal("    contents=prompt,", "code-call");
      logToTerminal("    config=types.GenerateContentConfig(", "code-call");
      logToTerminal("        tools=[types.Tool(file_search=types.FileSearch(store_id=\"fss_8d3b9e4a\"))]", "code-call");
      logToTerminal("    )", "code-call");
      logToTerminal(")", "code-call");
      logToTerminal("System: Running LLM evaluation with FileSearch capability...", "progress-msg");
      await delay(1500);
      
      const assessment = evaluateSkills(uploadedFileContent);

      logToTerminal(`System: [COMPLETED] Model output received from gemini-3-flash-preview.`, "success-msg");
      await delay(400);
      logToTerminal(`print(response.text)`, "cmd-prompt");
      logToTerminal(`Recommended Placement: ${assessment.committee} (Confidence: ${assessment.score})`, "success-msg");
      logToTerminal(`Reasoning: ${assessment.reasoning}`, "success-msg");

      // Update Results Card
      placementCommittee.textContent = assessment.committee;
      matchScore.textContent = `${assessment.score} Match`;
      analysisReasoning.textContent = assessment.reasoning;
      
      // Save Application to LocalStorage
      saveToDatabase({
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        studentNumber: studentNumInput.value.trim(),
        contactNumber: contactNumInput.value.trim(),
        yearLevel: yearLevelSelect.value,
        courseMajor: courseMajorSelect.value,
        fileName: uploadedFileName,
        fileContent: uploadedFileContent,
        committee: assessment.committee,
        score: assessment.score,
        reasoning: assessment.reasoning,
        status: 'Applied',
        checklist: [false, false, false, false, false],
        appliedAt: new Date().toLocaleDateString()
      });

      analysisResults.classList.remove('hidden');

    } catch (err) {
      logToTerminal(`System Error: Evaluation failed. ${err.message}`, "terminal-line error-msg");
      alert("An error occurred during evaluation: " + err.message);
    } finally {
      isAnalyzing = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> <span>Analyze with Gemini File Search</span>';
    }
  });

  /* ----------------------------------------------------
     DATABASE CONTROLLER (LOCAL STORAGE SYNC)
     ---------------------------------------------------- */
  function saveToDatabase(newRecord) {
    let applicants = JSON.parse(localStorage.getItem('orgalink_applicants')) || [];
    
    // Check if the user has already applied (matching email)
    const existingIndex = applicants.findIndex(app => app.email.toLowerCase() === newRecord.email.toLowerCase());
    
    if (existingIndex > -1) {
      // Overwrite profile details while preserving current status and checklist states if any
      const existingApp = applicants[existingIndex];
      newRecord.status = existingApp.status;
      newRecord.checklist = existingApp.checklist;
      applicants[existingIndex] = newRecord;
      logToTerminal("System: Existing profile found. Updated registration and re-ran analysis.", "progress-msg");
    } else {
      applicants.push(newRecord);
      logToTerminal("System: Profile saved successfully to local database.", "progress-msg");
    }
    
    localStorage.setItem('orgalink_applicants', JSON.stringify(applicants));
  }
});
