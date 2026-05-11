const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('file-upload');
const dropZonePrompt = document.getElementById('drop-zone-prompt');
const fileInfo = document.getElementById('file-info');
const fileNameDisplay = document.getElementById('file-name');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');

fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        const fileSizeMB = file.size / (1024 * 1024);
        const resourceType = document.getElementById('resource-type').value;

        if (resourceType === 'pdf' && fileSizeMB > 25) {
            alert(`PDF too large (${fileSizeMB.toFixed(1)}MB). Max 25MB.`);
            this.value = '';
            return;
        }
        if (resourceType === 'video' && fileSizeMB > 500) {
            alert(`Video too large (${fileSizeMB.toFixed(1)}MB). Max 500MB.`);
            this.value = '';
            return;
        }

        fileNameDisplay.textContent = file.name;
        dropZonePrompt.style.display = 'none';
        fileInfo.style.display = 'block';
    }
});

window.clearFile = function(event) {
    if (event) event.stopPropagation();
    fileInput.value = '';
    fileInfo.style.display = 'none';
    dropZonePrompt.style.display = 'block';
    if (progressContainer) progressContainer.style.display = 'none';
};

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    const fullName = user ? user.name : localStorage.getItem('userName');
    
    const file = fileInput.files[0];
    const title = document.getElementById('resource-title').value;
    const type = document.getElementById('resource-type').value;
    const desc = document.getElementById('resource-desc').value;

    if (!fullName) return alert("Session expired. Please log in again.");
    if (!file) return alert("Please select a file first.");

    const submitBtn = document.getElementById('publishBtn') || uploadForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = "Processing...";

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('resource_type', type);
    formData.append('description', desc);
    formData.append('uploaded_by_name', fullName);

    if (progressContainer) progressContainer.style.display = 'block';

    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', '/api/resources/upload', true);

    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            if (progressBar) {
                progressBar.style.width = percentComplete + '%';
                submitBtn.innerText = `Uploading (${percentComplete}%)`;
            }
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 201) {
            alert("Module Published Successfully!");
            window.location.href = '/library';
        } else {
            const error = JSON.parse(xhr.responseText);
            alert("Upload failed: " + (error.error || "Server error"));
            resetButton();
        }
    };

    xhr.onerror = function() {
        alert("Network error occurred during upload.");
        resetButton();
    };

    xhr.send(formData);

    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.innerText = "Publish to Repository";
        if (progressContainer) progressContainer.style.display = 'none';
    }
});