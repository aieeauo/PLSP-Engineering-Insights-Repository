function showForm(type) {
    const logIn = document.getElementById('login-form');
    const signUp = document.getElementById('signup-form');
    const tabs = document.querySelectorAll('.tab-link');

    if (type === 'login') {
        logIn.style.display = 'block';
        signUp.style.display = 'none';
        
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('[onclick="showForm(\'signin\')"]').classList.add('active');
    } else {
        logIn.style.display = 'none';
        signUp.style.display = 'block';
        
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('[onclick="showForm(\'signup\')"]').classList.add('active');
    }
}

document.querySelector('#login-form form').addEventListener('submit', function(e) {
    e.preventDefault();

    loginAsInstructor(); 
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            localStorage.setItem('userRole', 'instructor');
            
            window.location.href = 'admin.html';
        });
    }
});