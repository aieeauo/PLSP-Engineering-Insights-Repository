let existingFileIsRemoved = false;

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) return;
    
    const idField = document.getElementById('resourceId');
    if(idField) idField.value = id;

    try {
        const response = await fetch(`https://plsp-engg-insights-repository.onrender.com/api/resources`);
        const resources = await response.json();
        const item = resources.find(r => r.resources_id == id);

        if (!item) return;

        document.getElementById('resourceTitle').value = item.title;
        document.getElementById('resourceDescription').value = item.description || '';
        document.getElementById('resourceType').value = item.resource_type.toLowerCase();

        const fileUploadState = document.getElementById('file-upload-state');
        const filePreviewState = document.getElementById('file-preview-state');
        const previewFileName = document.getElementById('preview-file-name');
        const dropZone = document.getElementById('drop-zone');

        if (item.file_url) {
            fileUploadState.style.display = 'none';
            filePreviewState.style.display = 'block';
            dropZone.classList.add('has-file');

            const fileNameFromUrl = item.file_url.split('/').pop();
            previewFileName.innerText = fileNameFromUrl;
        }
        
        console.log("File loaded:", item.file_url);

    } catch (err) {
        console.error("Error loading data:", err);
    }
});

function handleNewFileSelected(input) {
    if (input.files && input.files[0]) {
        document.getElementById('preview-file-name').innerText = input.files[0].name;
        document.getElementById('file-upload-state').style.display = 'none';
        document.getElementById('file-preview-state').style.display = 'block';
    }
}

function removeExistingFile(event) {
    event.stopPropagation();
    existingFileIsRemoved = true;
    document.getElementById('file-upload-state').style.display = 'block';
    document.getElementById('file-preview-state').style.display = 'none';
    document.getElementById('fileInput').value = ''; 
}

function handleNewFileSelected(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileSizeMB = file.size / (1024 * 1024);
        const resourceType = document.getElementById('resourceType').value;

        if (resourceType === 'pdf' && fileSizeMB > 25) {
            alert(`PDF too large (${fileSizeMB.toFixed(1)}MB). Max 25MB.`);
            input.value = '';
            return;
        }
        if (resourceType === 'video' && fileSizeMB > 500) {
            alert(`Video too large (${fileSizeMB.toFixed(1)}MB). Max 500MB.`);
            input.value = '';
            return;
        }

        document.getElementById('preview-file-name').innerText = file.name;
        document.getElementById('file-upload-state').style.display = 'none';
        document.getElementById('file-preview-state').style.display = 'block';
    }
}

const dropZone = document.getElementById('drop-zone');
if(dropZone) {
    dropZone.addEventListener('click', (e) => {
        if (e.target.id === 'btn-remove-file' || e.target.closest('#btn-remove-file')) return;
        document.getElementById('fileInput').click();
    });
}

document.getElementById('editResourceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('resourceId').value;
    const formData = new FormData();
    
    formData.append('title', document.getElementById('resourceTitle').value);
    formData.append('description', document.getElementById('resourceDescription').value);
    formData.append('resource_type', document.getElementById('resourceType').value);
    formData.append('userName', 'Admin'); 

    const fileField = document.getElementById('fileInput');
    if (fileField.files[0]) {
        formData.append('file', fileField.files[0]);
    } else if (existingFileIsRemoved) {
        formData.append('removeFile', 'true'); 
    }

    try {
        const response = await fetch(`https://plsp-engg-insights-repository.onrender.com/api/resources/${id}`, {
            method: 'PUT',
            body: formData 
        });

        if (response.ok) {
            alert("Repository Updated Successfully!");
            window.location.href = 'library.html';
        } else {
            const errorData = await response.json();
            alert("Error: " + errorData.error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    } catch (err) {
        console.error("Update failed:", err);
        alert("Failed to connect to server.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});