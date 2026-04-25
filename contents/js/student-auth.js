document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form form');
    const signupForm = document.querySelector('#signup-form form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const student_number = document.getElementById('login-student_number').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_number, password })
        });
                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('userRole', 'student');
                    localStorage.setItem('studentNumber', data.user.student_number);
                    localStorage.setItem('userName', `${data.user.first_name} ${data.user.last_name}`);
                    window.location.href = 'index.html';
                } else {
                    alert(data.error || "Login failed. Check your credentials.");
                }
            } catch (err) {
                alert("Connection error.");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const first_name = document.getElementById('signup-firstname').value;
    const last_name = document.getElementById('signup-lastname').value;
    const student_number = document.getElementById('signup-student_number').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/signup/student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                first_name, 
                last_name, 
                student_number, 
                password 
            })
        });

        if (response.ok) {
            alert("Student account created successfully!");
            showForm('login');
        } else {
            const data = await response.json();
            alert(data.error || "Registration failed.");
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        alert("Server error during registration.");
    }
});
    }
});

function showForm(type) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabs = document.querySelectorAll('.tab-link');

    if (type === 'signup') {
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        tabs[1].classList.add('active');
        tabs[0].classList.remove('active');
    }
}