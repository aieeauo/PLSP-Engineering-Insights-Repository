document.addEventListener("DOMContentLoaded", function() {
    const instructorSelect = document.getElementById("instructor");
    const inquiryForm = document.getElementById("inquiryForm");

    function syncInstructors() {
        const savedInstructors = JSON.parse(localStorage.getItem("plsp_instructors")) || [];
        
        instructorSelect.innerHTML = `
            <option value="plsp.coe@plsp.edu.ph">General (Office of the Dean)</option>
        `;

        savedInstructors.forEach(inst => {
            if (inst.name !== "Engr. Anniejel Llaguno" && inst.name !== "Engr. Jericho Ontalan") {
                const option = document.createElement("option");
                option.value = inst.email;
                option.textContent = inst.name;
                instructorSelect.appendChild(option);
            }
        });
    }

    syncInstructors();

    inquiryForm.addEventListener("submit", function(e) {
        const name = document.getElementById("fullName").value;
        const prog = document.getElementById("program").value;
        const target = instructorSelect.value;
        const msg = document.getElementById("message").value;

        const subject = encodeURIComponent(`Inquiry for Engineering Faculty: ${name}`);
        const body = encodeURIComponent(`Student: ${name}\nProgram: ${prog}\n\nMessage:\n${msg}`);

        this.action = `mailto:${target}?subject=${subject}&body=${body}`;
    });
});