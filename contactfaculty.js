document.addEventListener("DOMContentLoaded", function() {
    const inquiryForm = document.getElementById("inquiryForm"); 
    const instructorSelect = document.getElementById("instructor");

    function syncInstructors() {
        const savedInstructors = JSON.parse(localStorage.getItem("plsp_instructors")) || [];
        instructorSelect.innerHTML = `<option value="plsp.coe@plsp.edu.ph">General (Office of the Dean)</option>`;

        savedInstructors.forEach(inst => {
            const option = document.createElement("option");
            option.value = inst.id; 
            option.textContent = inst.name;
            instructorSelect.appendChild(option);
        });
    }
    syncInstructors();

    inquiryForm.addEventListener("submit", async function(e) {
        e.preventDefault(); 

        const formData = {
            studentId: localStorage.getItem('userId'), 
            instructorId: instructorSelect.value,
            fullName: document.getElementById("fullName").value,
            program: document.getElementById("program").value,
            message: document.getElementById("message").value
        };

        try {
            const response = await fetch('http://localhost:3000/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Message sent successfully!");
                inquiryForm.reset();
            } else {
                alert("Failed to send message.");
            }
        } catch (error) {
            console.error("Connection Error:", error);
            alert("Cannot connect to the server.");
        }
    });
});