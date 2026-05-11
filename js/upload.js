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
    const fullName = user ? (user.first_name + " " + user.last_name) : localStorage.getItem('userName');
    const file = fileInput.files[0];
    const title = document.getElementById('resource-title').value;
    const type = document.getElementById('resource-type').value;
    const desc = document.getElementById('resource-desc').value;
    const submitBtn = document.getElementById('publishBtn') || uploadForm.querySelector('button[type="submit"]');

    if (!fullName) return alert("Session expired. Please log in again.");
    if (!file) return alert("Please select a file first.");

    submitBtn.disabled = true;
    if (progressContainer) progressContainer.style.display = 'block';

    if (type === 'video') {
        try {
            submitBtn.innerText = "Uploading Video...";
            const cloudFormData = new FormData();
            cloudFormData.append('file', file);
            cloudFormData.append('upload_preset', 'my_preset'); 
            cloudFormData.append('cloud_name', 'drofq9qgr');

            const xhr = new XMLHttpRequest();
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    xhr.open('POST', `https://api.cloudinary.com/v1_1/drofq9qgr/video/upload`, true);
                    
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percent = Math.round((event.loaded / event.total) * 100);
                            if (progressBar) progressBar.style.width = percent + '%';
                            submitBtn.innerText = `Cloud Upload (${percent}%)`;
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                        else reject("Cloudinary Upload Failed");
                    };
                    xhr.onerror = () => reject("Network error during Cloudinary upload");
                    xhr.send(cloudFormData);
                });
            };

            const cloudData = await uploadToCloudinary();
            
            submitBtn.innerText = "Finalizing...";
            const dbResponse = await fetch('/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    description: desc,
                    resource_type: type,
                    file_url: cloudData.secure_url, 
                    uploaded_by_name: fullName
                })
            });

            if (dbResponse.ok) {
                alert("Video Published Successfully!");
                window.location.href = '/library';
            } else {
                throw new Error("Database failed to save video link.");
            }

        } catch (err) {
            alert("Upload failed: " + err);
            resetButton();
        }

    } else {
        submitBtn.innerText = "Uploading PDF...";
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('resource_type', type);
        formData.append('description', desc);
        formData.append('uploaded_by_name', fullName);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/resources', true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                if (progressBar) progressBar.style.width = percent + '%';
                submitBtn.innerText = `Uploading (${percent}%)`;
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200 || xhr.status === 201) {
                alert("PDF Published Successfully!");
                window.location.href = '/library';
            } else {
                alert("Upload failed. Check file size.");
                resetButton();
            }
        };

        xhr.onerror = () => {
            alert("Network error.");
            resetButton();
        };

        xhr.send(formData);
    }

    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.innerText = "Publish to Repository";
        if (progressContainer) progressContainer.style.display = 'none';
        if (progressBar) progressBar.style.width = '0%';
    }
});