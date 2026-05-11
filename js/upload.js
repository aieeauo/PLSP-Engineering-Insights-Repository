uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    const title = document.getElementById('resource-title').value;
    const desc = document.getElementById('resource-desc').value;
    const type = document.getElementById('resource-type').value; 
    const submitBtn = document.getElementById('publishBtn');
    const user = JSON.parse(localStorage.getItem('user'));
    const fullName = user ? user.name : "Anonymous";

    if (!file) return alert("Please select a file.");
    
    submitBtn.disabled = true;
    if (progressContainer) progressContainer.style.display = 'block';

    if (type === 'video') {
        try {
            const cloudData = new FormData();
            cloudData.append('file', file);
            cloudData.append('upload_preset', 'my_preset'); 

            const xhr = new XMLHttpRequest();
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    xhr.open('POST', `https://api.cloudinary.com/v1_1/drofq9qgr/video/upload`, true);
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percent = Math.round((event.loaded / event.total) * 100);
                            progressBar.style.width = percent + '%';
                            submitBtn.innerText = `Uploading Video (${percent}%)`;
                        }
                    };
                    xhr.onload = () => resolve(JSON.parse(xhr.responseText));
                    xhr.onerror = () => reject("Cloudinary Upload Failed");
                    xhr.send(cloudData);
                });
            };

            const cloudRes = await uploadToCloudinary();
            
            await fetch('/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title, description: desc, resource_type: type,
                    file_url: cloudRes.secure_url, uploaded_by_name: fullName
                })
            });
            
            alert("Video Published!");
            window.location.href = '/library';
        } catch (err) {
            alert("Video upload failed");
            resetButton();
        }

    } else {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', desc);
        formData.append('resource_type', type);
        formData.append('uploaded_by_name', fullName);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/resources', true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                progressBar.style.width = percent + '%';
                submitBtn.innerText = `Uploading PDF (${percent}%)`;
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200 || xhr.status === 201) {
                alert("PDF Published!");
                window.location.href = '/library';
            } else {
                alert("PDF Upload failed");
                resetButton();
            }
        };
        xhr.send(formData);
    }
});