let allResources = []; 
let filteredResources = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener("DOMContentLoaded", () => {
    fetchRepositoryData();
    
    const searchInput = document.getElementById('repoSearch');
    const filterSelect = document.getElementById('resourceFilter');
    
    if (searchInput) searchInput.addEventListener('input', filterResources);
    if (filterSelect) filterSelect.addEventListener('change', filterResources);
});

async function fetchRepositoryData() {
    const container = document.getElementById('insightsGrid');
    if (!container) return;

    try {
        const response = await fetch('/api/resources');
        if (!response.ok) throw new Error("Could not load repository data.");

        const resources = await response.json();
        
        allResources = resources; 
        filteredResources = [...allResources];

        if (allResources.length === 0) {
            container.innerHTML = '<p class="text-dim">No resources found in the repository.</p>';
            return;
        }

        displayPage(1); 
    } catch (err) {
        console.error("Fetch Error:", err);
        container.innerHTML = `<p class="text-danger">Failed to load repository. Please try again later.</p>`;
    }
}

function displayPage(page) {
    const container = document.getElementById('insightsGrid');
    if (!container) return;

    container.innerHTML = ''; 
    currentPage = page;

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filteredResources.slice(start, end);

    paginatedItems.forEach(res => {
        const col = document.createElement('div');
        col.className = "col-md-6 col-12 mb-4"; 

        const isPdf = res.resource_type.toLowerCase() === 'pdf';
        const badgeClass = isPdf ? 'card-tag' : 'card-tag video';
        const iconClass = isPdf ? 'fa-file-pdf' : 'fa-video';
        
        const fileUrl = res.file_url;

        col.innerHTML = `
            <div class="insight-card h-100 d-flex flex-column"> 
                <div class="${badgeClass}">${res.resource_type.toUpperCase()}</div>
                <i class="fa-solid ${iconClass} card-main-icon"></i>
                <h3>${res.title}</h3>
                <p class="card-description">${res.description || 'No description available.'}</p>
                
                <div class="card-footer mt-auto d-flex justify-content-between align-items-center">
                    <span class="uploader-name">
                        uploaded by ${res.uploaded_by_name || 'Instructor'}
                    </span>

                    <div class="footer-btns d-flex gap-2">
                        <button class="btn-download" onclick="handleDownload('${fileUrl}')">
                            <i class="fa-solid fa-download"></i> Download
                        </button>
                        ${!isPdf ? `
                        <button class="btn-watch" onclick="openVideo('${fileUrl}', '${res.title.replace(/'/g, "\\'")}')">
                            <i class="fa-solid fa-play"></i> Watch
                        </button>` : ''}
                    </div>
                </div>
            </div>`;
        container.appendChild(col);
    });

    setupPaginationButtons();
}

function handleDownload(fileUrl) {
    const userRole = localStorage.getItem('userRole') || 'guest';
    
    if (userRole === 'guest') {
        alert("Access Restricted: Please log in to download modules.");
        window.location.href = '/portalaccess';
    } else {
        window.open(fileUrl, '_blank');
    }
}

function openVideo(videoSrc, videoTitle) {
    const userRole = localStorage.getItem('userRole') || 'guest';

    if (userRole === 'student' || userRole === 'instructor') {
        const videoPlayer = document.getElementById('modalVideoPlayer');
        const modalTitle = document.getElementById('videoModalLabel');
        
        if (videoPlayer && modalTitle) {
            videoPlayer.src = videoSrc; 
            modalTitle.innerText = videoTitle;
            
            const myModal = new bootstrap.Modal(document.getElementById('videoModal'));
            myModal.show();
            
            videoPlayer.load(); 
            videoPlayer.play().catch(err => console.log("Playback interaction required."));
        }
    } else {
        alert("Access Restricted: Please log in to watch lecture videos.");
        window.location.href = '/portalaccess';
    }
}

function filterResources() {
    const searchTerm = document.getElementById('repoSearch').value.toLowerCase();
    const filterValue = document.getElementById('resourceFilter').value.toLowerCase();

    filteredResources = allResources.filter(res => {
        const title = res.title.toLowerCase();
        const desc = (res.description || "").toLowerCase();
        const type = res.resource_type.toLowerCase();

        const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
        const matchesFilter = (filterValue === 'all') || (type === filterValue);

        return matchesSearch && matchesFilter;
    });

    displayPage(1);
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

const myModalEl = document.getElementById('videoModal');
if (myModalEl) {
    myModalEl.addEventListener('hidden.bs.modal', () => {
        const videoPlayer = document.getElementById('modalVideoPlayer');
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.src = "";
        }
    });
}