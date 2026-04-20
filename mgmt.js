/**
 * Role Manager - Central Logic for View Separation
 */

// This function runs automatically on every page
function applyViewPermissions() {
    const userRole = localStorage.getItem('userRole') || 'student';
    const isInstructor = (userRole === 'instructor');

    // A. VISIBILITY: Navigation Links
    // Elements with class "instructor-link" will only show for instructors
    document.querySelectorAll('.instructor-link').forEach(el => {
        el.style.display = isInstructor ? 'inline-block' : 'none';
    });

    // B. RESOURCES: Management Cards
    // Elements with class "instructor-only" (like an "Upload" card)
    document.querySelectorAll('.instructor-only').forEach(el => {
        el.style.display = isInstructor ? 'flex' : 'none';
    });

    // C. ANALYTICS: Admin controls in index.html
    const resetBtn = document.getElementById('reset-analytics-btn');
    if (resetBtn) {
        resetBtn.style.display = isInstructor ? 'inline-block' : 'none';
    }
}

// Function to call during Instructor Login
function loginAsInstructor() {
    localStorage.setItem('userRole', 'instructor');
    window.location.href = 'admin.html';
}

// Function to call for Logout
function logout() {
    localStorage.setItem('userRole', 'student');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', applyViewPermissions);