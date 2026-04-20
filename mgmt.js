function applyViewPermissions() {
    const userRole = localStorage.getItem('userRole') || 'student';
    const isInstructor = (userRole === 'instructor');

    document.querySelectorAll('.instructor-link').forEach(el => {
        el.style.display = isInstructor ? 'inline-block' : 'none';
    });

    document.querySelectorAll('.student-only-link').forEach(el => {
        el.style.display = isInstructor ? 'none' : 'inline-block';
    });

    document.querySelectorAll('.instructor-only').forEach(el => {
        el.style.display = isInstructor ? 'flex' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', applyViewPermissions);