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
        el.style.display = isGuest ? 'none' : 'inline-block';
    });

    document.querySelectorAll('.guest-only').forEach(el => {
        el.style.display = isGuest ? 'inline-block' : 'none';
    });

    document.querySelectorAll('.logout-link').forEach(el => {
        el.style.display = isGuest ? 'none' : 'inline-block';
    });

    if (isGuest) {
        document.querySelectorAll('.btn-watch, .btn-download').forEach(btn => {
            btn.style.opacity = "0.6";
            btn.style.cursor = "not-allowed";
        });
    }
}

window.logoutUser = function(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('userRole'); 
    window.location.href = 'index.html';    
};

document.addEventListener('DOMContentLoaded', applyViewPermissions);