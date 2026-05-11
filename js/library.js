document.addEventListener("DOMContentLoaded", loadLibrary);

async function loadLibrary() {
    const listContainer = document.querySelector('.library-list-wrapper'); 
    if (!listContainer) return;

    try {
        const response = await fetch('/api/resources');
        if (!response.ok) throw new Error("Failed to fetch library.");
        
        const resources = await response.json();
        listContainer.innerHTML = ''; 

        const user = JSON.parse(localStorage.getItem('user')) || {};
        const currentUserName = user.name;

        if (resources.length === 0) {
            listContainer.innerHTML = '<p class="text-center text-dim py-5">No resources found in the repository.</p>';
            return;
        }

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
                        <button onclick="redirectToEdit('${item.resources_id}')" class="btn-edit">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="deleteResource('${item.resources_id}')" class="btn-delete">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : '<span class="badge bg-secondary">Read Only</span>'}
                </div>
            `;
            listContainer.appendChild(row);
        });
    } catch (err) {
        console.error("Library Load Error:", err);
        listContainer.innerHTML = '<p class="text-danger text-center">Error loading library content.</p>';
    }
}

function redirectToEdit(id) {
    window.location.href = `/edit.html?id=${id}`;
}

async function deleteResource(id) {
    if (!confirm("Are you sure? This will permanently remove the file from storage and the repository.")) return;

    try {
        const response = await fetch(`/api/resources/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Resource deleted successfully.");
            loadLibrary(); 
        } else {
            const error = await response.json();
            alert("Delete failed: " + (error.error || "Server error"));
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to connect to the server.");
    }
}

function setupPaginationButtons() {
    const wrapper = document.getElementById('paginationButtons');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    const pageCount = Math.ceil(filteredResources.length / itemsPerPage);
    if (pageCount <= 1) return;

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        btn.onclick = () => {
            displayPage(i);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        wrapper.appendChild(btn);
    }
}