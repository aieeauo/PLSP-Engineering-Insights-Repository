const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-upload');
const dropPrompt = document.getElementById('drop-zone-prompt');
const fileInfo = document.getElementById('file-info');
const fileNameDisplay = document.getElementById('file-name');

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', function() {
    if (this.files.length > 0) {
        updateDropZoneWithFile(this.files[0].name);
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    dropZone.style.borderColor = "var(--accent-gold)";
    dropZone.style.background = "rgba(255, 183, 3, 0.1)";
});

dropZone.addEventListener('dragleave', () => {
    if (fileInput.files.length === 0) {
        dropZone.style.borderColor = "var(--glass-border)";
        dropZone.style.background = "transparent";
    }
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        updateDropZoneWithFile(files[0].name);
    }
});

function updateDropZoneWithFile(name) {
    fileNameDisplay.innerText = name;
    dropPrompt.style.display = 'none';
    fileInfo.style.display = 'block';
    
    dropZone.style.borderColor = "var(--accent-gold)";
    dropZone.style.background = "rgba(255, 183, 3, 0.1)";
}

function clearFile(event) {
    event.stopPropagation(); 
    fileInput.value = "";   
    
    dropPrompt.style.display = 'block';
    fileInfo.style.display = 'none';
    
    dropZone.style.borderColor = "var(--glass-border)";
    dropZone.style.background = "transparent";
}

document.querySelector('.upload-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Module successfully uploaded to the Engineering Insights Repository!");
    window.location.href = "admin.html";
});