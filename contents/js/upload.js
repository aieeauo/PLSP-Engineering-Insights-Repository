const uploadForm = document.querySelector('.upload-form');
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

fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    const fileType = file.type;
    const resourceType = document.getElementById('resource-type').value;

    if (resourceType === 'pdf' && fileSizeMB > 25) {
        alert("The PDF is too large. Max limit is 25MB.");
        this.value = ""; 
        return;
    }
    
    if (resourceType === 'video' && fileSizeMB > 500) {
        alert("The video is too large. Max limit is 500MB.");
        this.value = "";
        return;
    }

    fileNameDisplay.textContent = file.name;
    dropZonePrompt.style.display = 'none';
    fileInfo.style.display = 'block';
});