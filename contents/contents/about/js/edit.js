document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) return;

    document.getElementById('resourceId').value = id;

    try {
        const response = await fetch(`http://localhost:5000/api/resources`);
        const resources = await response.json();
        const item = resources.find(r => r.resources_id == id);

        if (item) {
            document.getElementById('resourceTitle').value = item.title;
            document.getElementById('resourceDescription').value = item.description;
            document.getElementById('resourceType').value = item.resource_type.toLowerCase();
        }
    } catch (err) {
        console.error("Error loading data:", err);
    }
});

document.getElementById('editResourceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('resourceId').value;
    const user = JSON.parse(localStorage.getItem('user'));
    
    const formData = new FormData();
    formData.append('title', document.getElementById('resourceTitle').value);
    formData.append('description', document.getElementById('resourceDescription').value);
    formData.append('resource_type', document.getElementById('resourceType').value);
    formData.append('userName', `${user.first_name} ${user.last_name}`);

    const fileField = document.getElementById('fileInput');
    if (fileField.files[0]) {
        formData.append('file', fileField.files[0]);
    }

    try {
        const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
            method: 'PUT',
            body: formData 
        });

        if (response.ok) {
            alert("Repository Updated Successfully!");
            window.location.href = 'library.html';
        } else {
            const error = await response.json();
            alert("Update failed: " + error.error);
        }
    } catch (err) {
        console.error("Update error:", err);
    }
});