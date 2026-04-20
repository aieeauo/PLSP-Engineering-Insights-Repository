/**
 * Role Manager - Central Logic for View Separation
 */

function applyViewPermissions() {
    const userRole = localStorage.getItem('userRole') || 'student';
    const isInstructor = (userRole === 'instructor');
    const isStudent = (userRole === 'student');

    // 1. INSTRUCTOR-ONLY: Management Link
    document.querySelectorAll('.instructor-link').forEach(el => {
        el.style.display = isInstructor ? 'inline-block' : 'none';
    });

    // 2. STUDENT-ONLY: Contact Faculty Link
    document.querySelectorAll('.student-only-link').forEach(el => {
        // Only display if the role is 'student'
        el.style.display = isStudent ? 'inline-block' : 'none';
    });

    // 3. REPOSITORY: Management Card
    document.querySelectorAll('.instructor-only').forEach(el => {
        el.style.display = isInstructor ? 'flex' : 'none';
    });

    // 4. ANALYTICS: Reset Button
    const resetBtn = document.getElementById('reset-analytics-btn');
    if (resetBtn) {
        resetBtn.style.display = isInstructor ? 'inline-block' : 'none';
    }
}

// ... (keep your login/logout functions as they were) ...

document.addEventListener('DOMContentLoaded', applyViewPermissions);