let currentEditItem = null;

document.addEventListener("DOMContentLoaded", loadLibrary);

async function loadLibrary() {
    try {
        const response = await fetch('http://localhost:5000/api/resources');
        const resources = await response.json();
        const listContainer = document.querySelector('.library-list');
        listContainer.innerHTML = ''; 

        resources.forEach(item => {
            const row = document.createElement('div');
            row.className = 'library-item';
            row.innerHTML = `
                <div class="item-info">
                    <i class="fa-solid ${item.resource_type === 'pdf' ? 'fa-file-pdf' : 'fa-video'}"></i>
                    <div>
                        <h4>${item.title}</h4>
                        <span>Uploaded by ${item.uploaded_by} • ${new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <a href="edit.html?id=${item.resources_id}" class="btn-edit text-decoration-none">
                        <i class="fa-solid fa-pen"></i> Edit
                    </a>
                    <button class="btn-delete" onclick="confirmDelete(this, ${item.resources_id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            `;
            listContainer.appendChild(row);
        });
    } catch (err) {
        console.error("Library load error:", err);
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