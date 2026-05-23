/**
 * OrgaLink AI Onboarding Portal - Status Tracker Controller
 * Handles:
 * 1. Email-based application lookup in LocalStorage
 * 2. RAG matching result display
 * 3. Recruitment timeline visualization
 * 4. Conditional onboarding checklist rendering (locked until Admin Approval)
 * 5. Checklist task completion tracking and persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('status-search-form');
  const searchEmailInput = document.getElementById('search-email');
  const resultsContainer = document.getElementById('tracker-results-container');

  // Summary Card Info
  const summaryName = document.getElementById('summary-name');
  const summaryStudentId = document.getElementById('summary-student-id');
  const summaryPhone = document.getElementById('summary-phone');
  const summaryCourse = document.getElementById('summary-course');
  const summaryYear = document.getElementById('summary-year');
  const summaryDate = document.getElementById('summary-date');
  const summaryPlacement = document.getElementById('summary-placement');
  const summaryScore = document.getElementById('summary-score');
  const summaryReasoning = document.getElementById('summary-reasoning');

  // Timeline & Checklist Boxes
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const lockedBox = document.getElementById('checklist-locked-box');
  const unlockedBox = document.getElementById('checklist-unlocked-box');
  const checkboxes = document.querySelectorAll('.checklist-checkbox');
  const progressText = document.getElementById('checklist-progress-text');
  const progressBar = document.getElementById('checklist-progress-bar');

  let currentApplicant = null;

  /* ----------------------------------------------------
     SEARCH FORM SUBMIT
     ---------------------------------------------------- */
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchEmail = searchEmailInput.value.trim().toLowerCase();
    
    // Get all applicants from database
    const applicants = JSON.parse(localStorage.getItem('orgalink_applicants')) || [];
    const applicant = applicants.find(app => app.email.toLowerCase() === searchEmail);

    if (!applicant) {
      alert("No application record found for this email address. Please make sure the spelling is correct or register on the 'Apply Now' page first.");
      resultsContainer.classList.add('hidden');
      currentApplicant = null;
      return;
    }

    currentApplicant = applicant;
    renderApplicantDashboard(applicant);
  });

  /* ----------------------------------------------------
     RENDER DASHBOARD FUNCTION
     ---------------------------------------------------- */
  function renderApplicantDashboard(applicant) {
    // 1. Fill Profile Fields
    summaryName.textContent = applicant.fullName;
    summaryStudentId.textContent = applicant.studentNumber || 'N/A';
    summaryPhone.textContent = applicant.contactNumber || 'N/A';
    summaryCourse.textContent = applicant.courseMajor || 'N/A';
    summaryYear.textContent = applicant.yearLevel || 'N/A';
    summaryDate.textContent = applicant.appliedAt || 'N/A';
    
    summaryPlacement.textContent = applicant.committee;
    summaryScore.textContent = `${applicant.score} Match`;
    summaryReasoning.textContent = applicant.reasoning;

    // 2. Render Timeline Progression
    updateTimeline(applicant.status);

    // 3. Render Checklist based on Vetting Approval Status
    if (applicant.status === 'Approved') {
      lockedBox.classList.add('hidden');
      unlockedBox.classList.remove('hidden');
      
      // Load saved checkmarks (default to false if unset)
      if (!applicant.checklist) {
        applicant.checklist = [false, false, false, false, false];
      }

      checkboxes.forEach((box, index) => {
        box.checked = applicant.checklist[index] || false;
        
        // Add listener to save check state change
        box.onchange = () => {
          applicant.checklist[index] = box.checked;
          saveApplicantState(applicant);
          updateChecklistStats();
        };
      });

      updateChecklistStats();
    } else {
      unlockedBox.classList.add('hidden');
      lockedBox.classList.remove('hidden');
    }

    // Reveal Dashboard container
    resultsContainer.classList.remove('hidden');
  }

  /* ----------------------------------------------------
     TIMELINE UPDATER
     ---------------------------------------------------- */
  function updateTimeline(status) {
    const statusMap = {
      'Applied': 1,
      'Screening': 1,
      'Interview': 2,
      'Approved': 3
    };
    
    const activeStepNum = statusMap[status] || 1;

    timelineSteps.forEach(step => {
      const stepVal = parseInt(step.getAttribute('data-step'));
      step.classList.remove('active', 'completed');
      
      if (stepVal < activeStepNum) {
        step.classList.add('completed');
        const icon = step.querySelector('.step-circle i');
        icon.className = 'fa-solid fa-circle-check';
      } else if (stepVal === activeStepNum) {
        step.classList.add('active');
        resetStepIcon(step, stepVal);
      } else {
        resetStepIcon(step, stepVal);
      }
    });
  }

  function resetStepIcon(step, stepVal) {
    const icon = step.querySelector('.step-circle i');
    if (stepVal === 1) icon.className = 'fa-regular fa-paper-plane';
    if (stepVal === 2) icon.className = 'fa-regular fa-comments';
    if (stepVal === 3) icon.className = 'fa-regular fa-handshake';
  }

  /* ----------------------------------------------------
     CHECKLIST PROGRESS CALCULATION
     ---------------------------------------------------- */
  function updateChecklistStats() {
    if (!currentApplicant) return;

    const total = checkboxes.length;
    let checkedCount = 0;

    checkboxes.forEach(box => {
      if (box.checked) checkedCount++;
    });

    progressText.textContent = `${checkedCount} of ${total} completed`;
    const percentage = (checkedCount / total) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  /* ----------------------------------------------------
     PERSIST CHECKBOXES STATE
     ---------------------------------------------------- */
  function saveApplicantState(applicant) {
    let applicants = JSON.parse(localStorage.getItem('orgalink_applicants')) || [];
    const idx = applicants.findIndex(app => app.email.toLowerCase() === applicant.email.toLowerCase());
    
    if (idx > -1) {
      applicants[idx] = applicant;
      localStorage.setItem('orgalink_applicants', JSON.stringify(applicants));
    }
  }
});
