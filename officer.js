/**
 * OrgaLink AI Onboarding Portal - Officer Dashboard Logic
 * Implements:
 * 1. Simple session checking with hardcoded credentials (admin@gmail.com / admin123)
 * 2. Committee statistics counters (Web Dev, Marketing, Logistics candidate counts)
 * 3. Sorting (Date, Name A-Z, Match Score) and Filtering (All, Accepted, Pending)
 * 4. Separate table actions for Move to Interview, Approve, View Details, and Delete
 */

document.addEventListener('DOMContentLoaded', () => {
  // Authentication Elements
  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('logout-btn');
  
  // Input fields
  const emailInput = document.getElementById('admin-email');
  const passwordInput = document.getElementById('admin-password');

  // Stats Counters
  const statTotal = document.getElementById('stat-total');
  const statInterview = document.getElementById('stat-interview');
  const statOnboarded = document.getElementById('stat-onboarded');

  // Committee breakdown counters
  const countWeb = document.getElementById('committee-web-count');
  const countMarketing = document.getElementById('committee-marketing-count');
  const countLogistics = document.getElementById('committee-logistics-count');

  // Dashboard filter & sort controls
  const filterStatusSelect = document.getElementById('filter-status');
  const sortBySelect = document.getElementById('sort-by');

  // Data Table Elements
  const tableBody = document.getElementById('table-body');

  // Modal Details Elements
  const modal = document.getElementById('applicant-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalName = document.getElementById('modal-name');
  const modalEmail = document.getElementById('modal-email');
  const modalId = document.getElementById('modal-id');
  const modalPhone = document.getElementById('modal-phone');
  const modalCourseYear = document.getElementById('modal-course-year');
  const modalFilename = document.getElementById('modal-filename');
  const modalScore = document.getElementById('modal-score');
  const modalCommittee = document.getElementById('modal-committee');
  const modalReasoning = document.getElementById('modal-reasoning');

  /* ----------------------------------------------------
     SESSION ROUTER & LIFECYCLE
     ---------------------------------------------------- */
  checkAuthSession();

  function checkAuthSession() {
    const isLoggedIn = sessionStorage.getItem('is_admin_logged_in') === 'true';
    if (isLoggedIn) {
      loginView.classList.add('hidden');
      dashboardView.classList.remove('hidden');
      renderDashboard();
    } else {
      loginView.classList.remove('hidden');
      dashboardView.classList.add('hidden');
    }
  }

  // Handle Login Submit
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === 'admin@gmail.com' && password === 'admin123') {
      sessionStorage.setItem('is_admin_logged_in', 'true');
      checkAuthSession();
      emailInput.value = '';
      passwordInput.value = '';
    } else {
      alert("Error: Unauthorized credentials. Use admin@gmail.com and admin123 to log in.");
    }
  });

  // Handle Logout Click
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('is_admin_logged_in');
    checkAuthSession();
  });

  // Handle filter changes
  filterStatusSelect.addEventListener('change', renderDashboard);
  sortBySelect.addEventListener('change', renderDashboard);

  /* ----------------------------------------------------
     DASHBOARD STATISTICS & LISTS BUILDER
     ---------------------------------------------------- */
  function renderDashboard() {
    const applicants = JSON.parse(localStorage.getItem('orgalink_applicants')) || [];

    // 1. Calculate General Metrics (Screening metric counter is removed)
    let total = applicants.length;
    let interviewCount = 0;
    let approvedCount = 0;

    applicants.forEach(app => {
      if (app.status === 'Interview') interviewCount++;
      else if (app.status === 'Approved') approvedCount++;
    });

    statTotal.textContent = total;
    statInterview.textContent = interviewCount;
    statOnboarded.textContent = approvedCount;

    // 2. Calculate Committee breakdown totals
    let webCount = 0;
    let marketingCount = 0;
    let logisticsCount = 0;

    applicants.forEach(app => {
      if (app.committee === 'Web Development') webCount++;
      else if (app.committee === 'Marketing & Creatives') marketingCount++;
      else if (app.committee === 'Logistics') logisticsCount++;
    });

    countWeb.textContent = webCount;
    countMarketing.textContent = marketingCount;
    countLogistics.textContent = logisticsCount;

    // 3. Filter candidates
    const activeFilter = filterStatusSelect.value;
    let filteredApplicants = [...applicants];

    if (activeFilter === 'accepted') {
      filteredApplicants = filteredApplicants.filter(app => app.status === 'Approved');
    } else if (activeFilter === 'pending') {
      // Pending review covers Applied, Screening, or Interview statuses
      filteredApplicants = filteredApplicants.filter(app => app.status !== 'Approved');
    }

    // 4. Sort candidates
    const activeSort = sortBySelect.value;
    filteredApplicants.sort((a, b) => {
      if (activeSort === 'name-asc') {
        return a.fullName.localeCompare(b.fullName);
      } 
      else if (activeSort === 'score-desc') {
        const scoreA = parseInt(a.score) || 0;
        const scoreB = parseInt(b.score) || 0;
        return scoreB - scoreA; // Descending score
      } 
      else {
        // Date Descending (Latest applied first)
        const dateA = new Date(a.appliedAt || 0);
        const dateB = new Date(b.appliedAt || 0);
        return dateB - dateA;
      }
    });

    // 5. Build table rows
    tableBody.innerHTML = '';

    if (filteredApplicants.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td colspan="6" class="empty-table-msg">
          <i class="fa-solid fa-folder-open" style="display: block; margin-bottom: 0.5rem; font-size: 1.5rem; color: var(--text-muted);"></i>
          No candidates found matching the selected filters.
        </td>
      `;
      tableBody.appendChild(emptyRow);
    } else {
      filteredApplicants.forEach(app => {
        const row = document.createElement('tr');

        // Status Badge styling
        let statusBadge = '';
        if (app.status === 'Approved') {
          statusBadge = '<span class="badge green">Approved</span>';
        } else if (app.status === 'Interview') {
          statusBadge = '<span class="badge purple">Interview</span>';
        } else {
          statusBadge = '<span class="badge blue">Applied</span>';
        }

        // Action Buttons
        const viewBtn = `<button class="action-btn view" title="View Profile Details"><i class="fa-regular fa-eye"></i></button>`;
        
        // Interview Button (only visible/enabled for Applied candidates)
        const isApplied = app.status === 'Applied';
        const interviewBtn = `<button class="action-btn interview ${isApplied ? '' : 'disabled'}" ${isApplied ? '' : 'disabled'} title="Move to Interview"><i class="fa-regular fa-comments"></i></button>`;

        // Approval Toggle Button (toggles approved status)
        const isApproved = app.status === 'Approved';
        const approveBtn = `<button class="action-btn approve ${isApproved ? 'active' : ''}" title="${isApproved ? 'Undo Approval' : 'Approve Candidate'}"><i class="${isApproved ? 'fa-solid fa-rotate-left' : 'fa-solid fa-check'}"></i></button>`;

        // Delete Button
        const deleteBtn = `<button class="action-btn delete" title="Delete record"><i class="fa-regular fa-trash-can"></i></button>`;

        // Ensure there is only one percent sign
        const scoreStr = app.score.toString();
        const displayScore = scoreStr.endsWith('%') ? scoreStr : `${scoreStr}%`;

        row.innerHTML = `
          <td>
            <div style="display: flex; flex-direction: column;">
              <strong style="color: var(--text-primary); font-weight: 600;">${app.fullName}</strong>
              <span style="color: var(--text-muted); font-size: 0.75rem;">${app.email}</span>
            </div>
          </td>
          <td>
            <div style="display: flex; flex-direction: column;">
              <strong>${app.studentNumber || 'N/A'}</strong>
              <span style="color: var(--text-muted); font-size: 0.75rem;">${app.courseMajor || 'N/A'} - Yr ${app.yearLevel || 'N/A'}</span>
            </div>
          </td>
          <td><span class="placement-badge" style="margin: 0; padding: 0.15rem 0.5rem; font-size: 0.75rem;">${app.committee}</span></td>
          <td><strong>${displayScore}</strong></td>
          <td>${statusBadge}</td>
          <td>
            <div class="action-btns">
              ${viewBtn}
              ${interviewBtn}
              ${approveBtn}
              ${deleteBtn}
            </div>
          </td>
        `;

        // Event listeners for actions
        row.querySelector('.action-btn.view').addEventListener('click', () => openDetailsModal(app));
        row.querySelector('.action-btn.interview').addEventListener('click', () => {
          if (isApplied) moveApplicantToInterview(app);
        });
        row.querySelector('.action-btn.approve').addEventListener('click', () => toggleApplicantApproval(app));
        row.querySelector('.action-btn.delete').addEventListener('click', () => deleteApplicantRecord(app));

        tableBody.appendChild(row);
      });
    }
  }
  // Open Evaluation Modal
  function openDetailsModal(app) {
    modalName.textContent = app.fullName;
    modalEmail.textContent = app.email;
    modalId.textContent = app.studentNumber || 'N/A';
    modalPhone.textContent = app.contactNumber || 'N/A';
    modalCourseYear.textContent = `${app.courseMajor || 'N/A'} - ${app.yearLevel || 'N/A'}`;
    modalFilename.textContent = app.fileName || 'N/A';
    
    const scoreStr = app.score.toString();
    const displayScore = scoreStr.endsWith('%') ? scoreStr : `${scoreStr}%`;
    modalScore.textContent = `${displayScore} Match`;
    modalCommittee.textContent = app.committee;
    modalReasoning.textContent = app.reasoning;

    modal.classList.remove('hidden');
  }

  // Move Candidate to Interview Status
  function moveApplicantToInterview(app) {
    let applicants = JSON.parse(localStorage.getItem('orgalink_applicants')) || [];
    const idx = applicants.findIndex(item => item.email.toLowerCase() === app.email.toLowerCase());

    if (idx > -1) {
      applicants[idx].status = 'Interview';
      localStorage.setItem('orgalink_applicants', JSON.stringify(applicants));
      renderDashboard();
    }
  }

  // Toggle approval / onboard status
  function toggleApplicantApproval(app) {
    let applicants = JSON.parse(localStorage.getItem('orgalink_applicants')) || [];
    const idx = applicants.findIndex(item => item.email.toLowerCase() === app.email.toLowerCase());

    if (idx > -1) {
      const currentStatus = applicants[idx].status;
      if (currentStatus === 'Approved') {
        // Toggle back to Interview
        applicants[idx].status = 'Interview';
      } else {
        // Approve
        applicants[idx].status = 'Approved';
      }
      localStorage.setItem('orgalink_applicants', JSON.stringify(applicants));
      renderDashboard();
    }
  }

  // Delete Candidate Record
  function deleteApplicantRecord(app) {
    if (!confirm(`Are you sure you want to permanently delete the application record for ${app.fullName}?`)) return;

    let applicants = JSON.parse(localStorage.getItem('orgalink_applicants')) || [];
    const filtered = applicants.filter(item => item.email.toLowerCase() !== app.email.toLowerCase());
    
    localStorage.setItem('orgalink_applicants', JSON.stringify(filtered));
    renderDashboard();
  }

  /* ----------------------------------------------------
     MODAL CONTROLLERS
     ---------------------------------------------------- */
  modalCloseBtn.onclick = () => modal.classList.add('hidden');
  
  // Close modal when clicking outside overlay
  window.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  };
});
