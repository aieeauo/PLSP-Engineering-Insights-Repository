document.addEventListener("DOMContentLoaded", fetchRepositoryData);

async function fetchRepositoryData() {
    const container = document.getElementById('insightsGrid');
    if (!container) return;

    try {
        const response = await fetch('http://localhost:5000/api/resources');
        const resources = await response.json();

        container.innerHTML = ''; 

        if (resources.length === 0) {
            container.innerHTML = '<p class="text-dim">No resources found in the repository.</p>';
            return;
        }

        resources.forEach(res => {
    const col = document.createElement('div');
    col.className = "col-md-6 mb-4"; 

    const isPdf = res.resource_type.toLowerCase() === 'pdf';
    const badgeClass = isPdf ? 'card-tag' : 'card-tag video';
    const iconClass = isPdf ? 'fa-microchip' : 'fa-play';
    const fileUrl = `http://localhost:5000${res.file_url}`;

    col.innerHTML = `
        <div class="insight-card h-100"> 
            <div class="${badgeClass}">${res.resource_type.toUpperCase()}</div>
            <i class="fa-solid ${iconClass} card-main-icon"></i>
            <h3>${res.title}</h3>
            <p>${res.description || 'No description available.'}</p>
            <div class="card-footer">
                <span class="uploader-name">uploaded by ${res.uploaded_by_name}</span>
                ${isPdf 
                    ? `<a href="${fileUrl}" class="btn-download" download>
                          <i class="fas fa-file-download"></i> Download
                       </a>`
                    : `<button class="btn-watch" onclick="openVideo('${fileUrl}', '${res.title.replace(/'/g, "\\'")}')">
                          <i class="fa fa-play"></i> Watch Now
                       </button>`
                }
            </div>
        </div>
    `;
    container.appendChild(col);
});
    } catch (err) {
        console.error("Fetch Error:", err);
        container.innerHTML = `<p class="text-danger">Failed to load repository: ${err.message}</p>`;
    }
}

function filterResources() {
    const searchTerm = document.getElementById('repoSearch').value.toLowerCase();
    const filterValue = document.getElementById('resourceFilter').value;
    const cards = document.querySelectorAll('.insight-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const description = card.querySelector('p').innerText.toLowerCase();
        const tagElement = card.querySelector('.card-tag');
        
        const tag = tagElement ? tagElement.innerText : 'all';

        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesFilter = (filterValue === 'all') || (tag === filterValue);

        if (matchesSearch && matchesFilter) {
            card.style.display = "flex";
            card.style.opacity = "1";
        } else {
            card.style.display = "none";
            card.style.opacity = "0";
        }
    });
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
            videoPlayer.play();
        }
    } else {
        alert("Access Restricted: Please log in to watch lecture videos.");
        window.location.href = 'portalaccess.html';
    }
}

function stopVideo() {
    const videoPlayer = document.getElementById('modalVideoPlayer');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = "";
    }
}

function togglePlay() {
    const video = document.getElementById('modalVideoPlayer');
    const playBtn = document.getElementById('playBtn');
    if (video.paused) {
        video.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
    } else {
        video.pause();
        playBtn.classList.replace('fa-pause', 'fa-play');
    }
}

function toggleMute() {
    video.muted = !video.muted;
    document.getElementById('volBtn').className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
}

function changeSpeed() {
    const btn = document.getElementById('speedBtn');
    if (video.playbackRate === 1) { video.playbackRate = 1.5; btn.innerText = "1.5x"; }
    else if (video.playbackRate === 1.5) { video.playbackRate = 2; btn.innerText = "2x"; }
    else { video.playbackRate = 1; btn.innerText = "1x"; }
}

function toggleFullScreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { 
        video.webkitRequestFullscreen();
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

function updateTimeDisplay() {
    if (video && timeDisplay) {
        const current = formatTime(video.currentTime);
        const total = formatTime(video.duration);
        timeDisplay.innerText = `${current} / ${total}`;
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