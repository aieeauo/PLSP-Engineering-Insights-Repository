document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form form');
    const signupForm = document.querySelector('#signup-form form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
        const email_address = loginForm.querySelector('#login-email_address').value;
        const password = loginForm.querySelector('#login-password').value;

try {
    const response = await fetch('http://localhost:5000/api/login/instructor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_address, password }) 
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('userRole', 'instructor');
        localStorage.setItem('userName', `${data.user.first_name} ${data.user.last_name}`);
        alert("Login successful!");
        window.location.href = '/index.html'; 
    } else {
        alert(data.error || "Login failed.");
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
    const email_address = document.getElementById('signup-email_address').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/signup/instructor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                first_name, 
                last_name, 
                email_address, 
                password 
            })
        });

        if (response.ok) {
            alert("Instructor account created successfully!");
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