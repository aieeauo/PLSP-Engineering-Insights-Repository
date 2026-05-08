let allResources = []; 
let filteredResources = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener("DOMContentLoaded", fetchRepositoryData);

async function fetchRepositoryData() {
    const container = document.getElementById('insightsGrid');
    if (!container) return;

    container.className = "row justify-content-center";

    try {
        const response = await fetch('https://plsp-engg-insights-repository.onrender.com/api/resources');
        allResources = await response.json(); 
        filteredResources = [...allResources];

        if (allResources.length === 0) {
            container.innerHTML = '<p class="text-dim">No resources found in the repository.</p>';
            return;
        }

        displayPage(1); 
    } catch (err) {
        console.error("Fetch Error:", err);
        container.innerHTML = `<p class="text-danger">Failed to load repository: ${err.message}</p>`;
    }
}

function displayPage(page) {
    const container = document.getElementById('insightsGrid');
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
        const iconClass = isPdf ? 'fa-microchip' : 'fa-play';
        const cleanPath = res.file_url.startsWith('/') ? res.file_url : `/${res.file_url}`;
        const fileUrl = `https://plsp-engg-insights-repository.onrender.com${cleanPath}`;

        col.innerHTML = `
            <div class="insight-card h-100 d-flex flex-column"> 
                <div class="${badgeClass}">${res.resource_type.toUpperCase()}</div>
                <i class="fa-solid ${iconClass} card-main-icon"></i>
                <h3>${res.title}</h3>
                <p class="card-description">${res.description || 'No description available.'}</p>
                
                <div class="card-footer mt-auto d-flex justify-content-between">
                    <span class="uploader-name">
                        <p> uploaded by ${res.uploaded_by_name || 'Instructor'} </p>
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

function setupPaginationButtons() {
    const paginationWrapper = document.getElementById('paginationButtons');
    if (!paginationWrapper) return;
    
    paginationWrapper.innerHTML = '';
    const pageCount = Math.ceil(filteredResources.length / itemsPerPage);

    if (currentPage > 1) {
        const previousBtn = document.createElement('button');
        previousBtn.innerText = 'Previous';
        previousBtn.classList.add('pagination-btn', 'pagination-previous');
        previousBtn.onclick = () => {
            displayPage(currentPage - 1);
            window.scrollTo(0, 0);
        };
        paginationWrapper.appendChild(previousBtn);
    }

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.classList.add('pagination-btn');
        if (i === currentPage) btn.classList.add('active');
        
        btn.onclick = () => {
            displayPage(i);
            window.scrollTo(0, 0); 
        };
        paginationWrapper.appendChild(btn);
    }

    if (currentPage < pageCount) {
        const nextBtn = document.createElement('button');
        nextBtn.innerText = 'Next';
        nextBtn.classList.add('pagination-btn', 'pagination-next');
        nextBtn.onclick = () => {
            displayPage(currentPage + 1);
            window.scrollTo(0, 0);
        };
        paginationWrapper.appendChild(nextBtn);
    }
}

function handleDownload(fileUrl) {
    const userRole = localStorage.getItem('userRole') || 'guest';
    if (userRole === 'guest') {
        alert("Access Restricted: Please log in to download the modules.");
        window.location.href = 'portalaccess.html';
    } else {
        window.open(fileUrl, '_blank');
    }
}

function filterResources() {
    const searchTerm = document.getElementById('repoSearch').value.toLowerCase();
    const filterValue = document.getElementById('resourceFilter').value.toLowerCase();

    filteredResources = allResources.filter(res => {
        const title = res.title.toLowerCase();
        const description = (res.description || "").toLowerCase();
        const tag = res.resource_type.toLowerCase().trim();

        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesFilter = (filterValue === 'all') || (tag === filterValue);

        return matchesSearch && matchesFilter;
    });

    displayPage(1);
}

const video = document.getElementById('modalVideoPlayer');
const timeDisplay = document.getElementById('videoTime');

function openVideo(videoSrc, videoTitle) {
    const userRole = localStorage.getItem('userRole');

    if (userRole === 'student' || userRole === 'instructor') {
        const videoPlayer = document.getElementById('modalVideoPlayer');
        const modalTitle = document.getElementById('videoModalLabel');
        
        if (videoPlayer && modalTitle) {
            videoPlayer.src = videoSrc; 
            modalTitle.innerText = videoTitle;
            
            const myModal = new bootstrap.Modal(document.getElementById('videoModal'));
            myModal.show();
            
            videoPlayer.load(); 
            videoPlayer.play().catch(err => console.log("Auto-play prevented:", err));
        }
    } else {
        alert("Access Restricted: Please log in to watch lecture videos.");
        window.location.href = 'contents/portalaccess.html';
    }
}

function stopVideo() {
    const videoPlayer = document.getElementById('modalVideoPlayer');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = "";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const myModalEl = document.getElementById('videoModal');
    if (myModalEl) {
        myModalEl.addEventListener('hidden.bs.modal', function () {
            video.pause();
            video.src = "";
        });
    }

    if (video) {
        video.onloadedmetadata = updateTimeDisplay;
        video.ontimeupdate = updateTimeDisplay;
    }

    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const userRole = localStorage.getItem('userRole') || 'guest';
            if (userRole === 'guest') {
                e.preventDefault();
                alert("Access Restricted: Please log in to download the modules.");
                window.location.href = 'portalaccess.html';
            }
        });
    });
});