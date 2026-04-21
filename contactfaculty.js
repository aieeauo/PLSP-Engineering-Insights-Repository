document.addEventListener("DOMContentLoaded", function() {
    const inquiryForm = document.getElementById("inquiryForm");

    inquiryForm.addEventListener("submit", function(e) {
        // For now, since we are frontend-only, let's just simulate the success
        e.preventDefault();

        // 1. Basic validation check
        const name = document.getElementById("fullName").value;
        const msg = document.getElementById("message").value;

        if (name && msg) {
            // 2. Show a simple "Success" message on the screen
            alert("Thank you, " + name + "! Your inquiry has been sent to the faculty.");
            inquiryForm.reset(); // Clear the form
        }
    });
});