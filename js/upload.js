uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    const type = document.getElementById('resource-type').value;
    const submitBtn = document.getElementById('publishBtn');
    
    if (!file) return alert("Please select a file.");
    submitBtn.disabled = true;

    try {
        if (type === 'video') {
            submitBtn.innerText = "Uploading to Cloudinary...";
            
            const cloudData = new FormData();
            cloudData.append('file', file);
            cloudData.append('upload_preset', 'my_preset'); 
            
            const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/drofq9qgr/video/upload`, {
                method: 'POST',
                body: cloudData
            });
            
            const cloudJson = await cloudRes.json();
            if (!cloudJson.secure_url) throw new Error("Cloudinary upload failed");

            submitBtn.innerText = "Saving to Database...";
            await fetch('/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: document.getElementById('resource-title').value,
                    description: document.getElementById('resource-desc').value,
                    resource_type: 'video',
                    file_url: cloudJson.secure_url, 
                    uploaded_by_name: JSON.parse(localStorage.getItem('user')).name
                })
            });

        } else {
            submitBtn.innerText = "Uploading PDF...";
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', document.getElementById('resource-title').value);
            formData.append('description', document.getElementById('resource-desc').value);
            formData.append('resource_type', 'pdf');
            formData.append('uploaded_by_name', JSON.parse(localStorage.getItem('user')).name);

            await fetch('/api/resources', {
                method: 'POST',
                body: formData 
            });
        }

        alert("Published Successfully!");
        window.location.href = '/library';

    } catch (err) {
        console.error(err);
        alert("Upload Error: " + err.message);
        submitBtn.disabled = false;
        submitBtn.innerText = "Publish to Repository";
    }
});