let currentEditItem = null;

document.addEventListener("DOMContentLoaded", loadLibrary);

async function loadLibrary() {
    try {
        const response = await fetch('http://localhost:5000/api/resources');
        const resources = await response.json();
        const listContainer = document.querySelector('.library-container'); 
        listContainer.innerHTML = ''; 

        const currentUserName = localStorage.getItem('userName');

        resources.forEach(item => {
            const isOwner = (item.uploaded_by_name === currentUserName);
            const row = document.createElement('div');
            row.className = 'library-item';

row.innerHTML = `
    <div class="item-info">
        <i class="fa-solid ${item.resource_type === 'pdf' ? 'fa-file-pdf' : 'fa-video'}"></i>
        <div>
            <h4>${item.title}</h4>
            <span>uploaded by ${item.uploaded_by_name} • ${new Date(item.created_at).toLocaleDateString()}</span>
        </div>
    </div>
    <div class="item-actions">
        ${isOwner ? `
            <button class="btn-edit" onclick="window.location.href='edit.html?id=${item.resources_id}'">
                <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button class="btn-delete" onclick="confirmDelete(${item.resources_id})">
                <i class="fa-solid fa-trash"></i> Delete
            </button>
        ` : ''}
    </div>
`;
            listContainer.appendChild(row);
        });
    } catch (err) {
        console.error("Library load error:", err);
    }
}

async function confirmDelete(id) {
    if (!confirm("Are you sure you want to delete this resource? This will permanently remove the file from the server.")) return;

    try {
        const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Deleted successfully!");
            loadLibrary(); 
        } else {
            const errorData = await response.json();
            alert("Error: " + errorData.error);
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to connect to the server.");
    }
}

function openEditModal(button) {
    currentEditItem = button.closest('.library-item');
    
    const currentTitle = currentEditItem.querySelector('h4').innerText;
    
    document.getElementById('editTitle').value = currentTitle;
    
    document.getElementById('editModal').style.display = "block";
}

function closeEditModal() {
    document.getElementById('editModal').style.display = "none";
}

document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const updatedTitle = document.getElementById('editTitle').value;
    
    if (currentEditItem) {
        currentEditItem.querySelector('h4').innerText = updatedTitle;
        
        currentEditItem.querySelector('span').innerText = "Modified: Just now";
    }
    
    closeEditModal();
});

window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) closeEditModal();
}