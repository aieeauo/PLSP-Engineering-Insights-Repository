function applyViewPermissions() {
    const userRole = localStorage.getItem('userRole') || 'guest';
    const isInstructor = (userRole === 'instructor');
    const isStudent = (userRole === 'student');
    const isGuest = (userRole === 'guest');

    document.querySelectorAll('.instructor-link').forEach(el => {
        el.style.display = isInstructor ? 'inline-block' : 'none';
    });

    document.querySelectorAll('.student-only-link').forEach(el => {
        el.style.display = isStudent ? 'inline-block' : 'none';
    });

    document.querySelectorAll('.restricted-nav').forEach(el => {
        el.style.display = (isStudent || isInstructor) ? 'inline-block' : 'none';
    });

    document.querySelectorAll('.guest-only').forEach(el => {
        el.style.display = isGuest ? 'inline-block' : 'none';
    });

    document.querySelectorAll('.logout-link').forEach(el => {
        el.style.display = !isGuest ? 'inline-block' : 'none';
    });

const userRole = localStorage.getItem('userRole') || 'guest';

if (userRole === 'guest') {
    document.querySelectorAll('.btn-watch, .btn-download').forEach(btn => {
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
        btn.title = "Login required";
    });
}
}

window.logoutUser = function() {

    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
};

document.addEventListener('DOMContentLoaded', applyViewPermissions);