document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('instructorLoginForm');
    const signupForm = document.getElementById('instructorSignupForm');
    const statusDiv = document.getElementById('auth-status');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const first_name = document.getElementById('signup-firstname').value;
            const last_name = document.getElementById('signup-lastname').value;
            const email = document.getElementById('signup-email').value; 
            const password = document.getElementById('signup-password').value;

            try {
                const response = await fetch('/api/auth/instructor/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ first_name, last_name, email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Instructor account created! Please log in.");
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
            
            const email = document.getElementById('login-email').value; 
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('/api/auth/instructor/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem('userRole', 'instructor');
                    localStorage.setItem('user', JSON.stringify({
                        name: `${result.user.first_name} ${result.user.last_name}`,
                        email: result.user.email,
                        role: 'instructor'
                    }));

                    alert("Login successful!");
                    window.location.href = '/admin'; 
                } else {
                    if (statusDiv) {
                        statusDiv.style.display = 'block';
                        statusDiv.style.color = '#ff4d4d';
                        statusDiv.innerText = result.error || "Invalid credentials.";
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