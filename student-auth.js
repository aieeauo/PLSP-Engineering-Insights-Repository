function showForm(type) {
    const logIn = document.getElementById('login-form');
    const signUp = document.getElementById('signup-form');
    const tabs = document.querySelectorAll('.tab-link');

    if (type === 'login') {
        logIn.style.display = 'block';
        signUp.style.display = 'none';
        
        // Update active tab styling
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('[onclick="showForm(\'signin\')"]').classList.add('active');
    } else {
        logIn.style.display = 'none';
        signUp.style.display = 'block';
        
        // Update active tab styling
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('[onclick="showForm(\'signup\')"]').classList.add('active');
    }
}

// Students should always be set to 'student' role
document.querySelector('#login-form form').addEventListener('submit', function(e) {
    localStorage.setItem('userRole', 'student');
    // Continue to repository.html as normal
});