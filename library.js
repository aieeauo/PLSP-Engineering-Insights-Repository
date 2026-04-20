let currentEditItem = null;

function confirmDelete(button) {
    if (confirm("Are you sure you want to delete this resource?")) {
        const item = button.closest('.library-item');
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            item.remove();
        }, 300);
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