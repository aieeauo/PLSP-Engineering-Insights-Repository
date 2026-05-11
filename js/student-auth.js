document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('studentLoginForm');
    const signupForm = document.getElementById('studentSignupForm');
    const statusDiv = document.getElementById('auth-status');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const first_name = document.getElementById('signup-firstname').value;
            const last_name = document.getElementById('signup-lastname').value;
            const student_number = document.getElementById('signup-student_number').value;
            const password = document.getElementById('signup-password').value;

            try {
                const response = await fetch('/api/student/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ first_name, last_name, student_number, password })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Student account created successfully! You can now log in.");
                    showForm('login'); 
                } else {
                    alert("Registration failed: " + (result.error || "Unknown error"));
                }
            } catch (err) {
                console.error("Signup error:", err);
                alert("Could not connect to the server.");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const student_number = document.getElementById('login-student_number').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ student_number, password })
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem('userRole', 'student');
                    localStorage.setItem('user', JSON.stringify({
                        name: `${result.user.first_name} ${result.user.last_name}`,
                        studentNumber: result.user.student_number,
                        role: 'student'
                    }));
                    
                    alert("Login successful!");
                    window.location.href = '/repository';
                } else {
                    if (statusDiv) {
                        statusDiv.style.display = 'block';
                        statusDiv.style.color = '#ff4d4d';
                        statusDiv.innerText = result.error || "Invalid Student Number or Password.";
                    } else {
                        alert("Login failed: " + (result.error || "Invalid credentials."));
                    }
                }
            } catch (err) {
                console.error("Login error:", err);
                alert("Server connection failed.");
            }
        });
    }
});

function showForm(type) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabSignup = document.getElementById('tab-signup');
    const tabLogin = document.getElementById('tab-login');

    if (type === 'signup') {
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
    } else {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        tabSignup.classList.remove('active');
        tabLogin.classList.add('active');
    }
}