document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resourceId = urlParams.get('id');
    const form = document.querySelector('form');

    if (!resourceId) {
        alert("No resource selected for editing.");
        window.location.href = 'library.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/resources/${resourceId}`);
        const data = await response.json();

        document.querySelector('input[type="text"]').value = data.title;
        document.querySelector('.portal-select').value = data.resource_type;
        document.querySelector('textarea').value = data.description;
    } catch (err) {
        console.error("Error loading resource data:", err);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedData = {
            title: document.querySelector('input[type="text"]').value,
            resource_type: document.querySelector('.portal-select').value,
            description: document.querySelector('textarea').value
        };

        try {
            const response = await fetch(`http://localhost:5000/api/resources/${resourceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                alert("Changes saved successfully!");
                window.location.href = 'library.html';
            } else {
                alert("Failed to update the resource.");
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("Connection error to the server.");
        }
    });
});