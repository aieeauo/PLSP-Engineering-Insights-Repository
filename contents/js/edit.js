const fileInput = document.getElementById('file-upload');
const dropZonePrompt = document.getElementById('drop-zone-prompt');
const fileInfo = document.getElementById('file-info');
const fileNameDisplay = document.getElementById('file-name');

fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        fileNameDisplay.textContent = this.files[0].name;
        dropZonePrompt.style.display = 'none';
        fileInfo.style.display = 'block';
    }
});

window.clearFile = function(event) {
    event.stopPropagation();
    fileInput.value = '';
    fileInfo.style.display = 'none';
    dropZonePrompt.style.display = 'block';
};

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = localStorage.getItem('userName'); 

    if (!fullName) {
        alert("Session not found. Please log in again to verify your name.");
        return;
    }

    if (!fileInput.files[0]) {
        alert("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append('title', document.getElementById('resource-title').value);
    formData.append('resource_type', document.getElementById('resource-type').value);
    formData.append('description', document.getElementById('resource-desc').value || "No description");
    formData.append('file', fileInput.files[0]);
    
    formData.append('uploaded_by_name', fullName); 

    try {
        const response = await fetch('http://localhost:5000/api/resources', {
            method: 'POST',
            body: formData 
        });

        if (response.ok) {
            alert(`Success! Published by ${fullName}`);
            window.location.href = 'library.html';
        } else {
            const errorData = await response.json();
            alert("Upload Failed: " + errorData.error);
        }
    } catch (err) {
        console.error("Connection error:", err);
        alert("Cannot connect to server.");
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resourceId = urlParams.get('id');
    const form = document.querySelector('.form-grid').closest('form');

    if (!resourceId) return;

    try {
        const response = await fetch(`http://localhost:5000/api/resources/${resourceId}`);
        const data = await response.json();

        document.querySelector('input[type="text"]').value = data.title;
        document.querySelector('.portal-select').value = data.resource_type;
        document.querySelector('textarea').value = data.description;
    } catch (err) {
        console.error("Load error:", err);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedData = {
        title: document.querySelector('input[type="text"]').value,
        resource_type: document.querySelector('.portal-select').value,
        description: document.querySelector('textarea').value,
        userName: localStorage.getItem('userName')
    };

        try {
            const response = await fetch(`http://localhost:5000/api/resources/${resourceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                alert("Update successful!");
                window.location.href = 'library.html';
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    });
});