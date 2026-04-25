document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form form');
    const signupForm = document.querySelector('#signup-form form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            try {
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                    email: email_address, 
                    password, 
                    role: 'instructor' 
                })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('userRole', 'instructor');
                    localStorage.setItem('userId', data.user.user_id);
                    localStorage.setItem('userName', `${data.user.first_name} ${data.user.last_name}`);
                    window.location.href = 'index.html';

                } else {
                    alert(data.error || "Login failed. Please check your credentials.");
                }
            } catch (err) {
                console.error("Login Error:", err);
                alert("Could not connect to the server.");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = signupForm.querySelectorAll('input');
            const firstName = document.getElementById('signup-firstname').value;
            const lastName = document.getElementById('signup-lastname').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            console.log("Sending to server:", { firstName, lastName, email, password });
            
            const formData = {
                first_name: inputs[0].value,
                last_name: inputs[1].value,
                email: inputs[2].value,
                password: inputs[3].value
            };

            try {
                const response = await fetch('http://localhost:5000/api/signup/instructor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ 
                    email: email_address, 
                    password, 
                    role: 'instructor' 
                })
                });

                if (response.ok) {
                    alert("Account created! You can now log in.");
                    showForm('login');
                } else {
                    const data = await response.json();
                    alert(data.error || "Registration failed.");
                }
            } catch (err) {
                alert("Server connection error.");
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