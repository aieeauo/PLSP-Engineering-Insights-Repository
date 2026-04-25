const uploadForm = document.querySelector('form[action="repository.html"]');

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.querySelector('input[placeholder*="e.g."]').value);
    formData.append('resource_type', document.querySelector('.portal-select').value);
    formData.append('description', document.querySelector('textarea').value);
    formData.append('file', document.getElementById('file-upload').files[0]);
    formData.append('uploaded_by_id', localStorage.getItem('userName'));
    const userId = localStorage.getItem('userId');

const formData = {
    title: document.getElementById('title').value,
    type: document.getElementById('type').value,
    fileUrl: filePath, 
    userId: userId 
};

    try {
        const response = await fetch('http://localhost:5000/api/resources', {
            method: 'POST',
            body: formData 
        });

        if (response.ok) {
            alert("Resource Published Successfully!");
            window.location.href = 'library.html';
        } else {
            alert("Error uploading file.");
        }
    } catch (err) {
        console.error("Upload failed:", err);
    }
});