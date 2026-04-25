document.addEventListener("DOMContentLoaded", fetchResources);

async function fetchResources() {
    try {
        const response = await fetch('http://localhost:5000/api/resources');
        const resources = await response.json();
        
        const container = document.querySelector('.repo-grid');
        container.innerHTML = ''; 

        resources.forEach(res => {
            const card = document.createElement('div');
            card.className = `insight-card ${res.resource_type}`;
            
            const icon = res.resource_type === 'pdf' ? 'fa-file-pdf' : 'fa-video';
            const actionBtn = res.resource_type === 'pdf' 
                ? `<a href="http://localhost:5000${res.file_url}" class="btn-download" download>Download PDF</a>`
                : `<button class="btn-watch" onclick="openVideo('http://localhost:5000${res.file_url}', '${res.title}')">Watch Lecture</button>`;

            card.innerHTML = `
                <div class="card-icon"><i class="fa-solid ${icon}"></i></div>
                <span class="card-tag">${res.resource_type.toUpperCase()}</span>
                <h3>${res.title}</h3>
                <p>${res.description || 'No description available.'}</p>
                <div class="card-footer">
                    <span>By ${res.uploaded_by}</span>
                    ${actionBtn}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading repository:", err);
    }
}

const video = document.getElementById('modalVideoPlayer');
const timeDisplay = document.getElementById('videoTime');

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

function openVideo(src, title) {
    const token = localStorage.getItem('userToken');

    if (!token) {
        alert("Access Restricted: Please log in to watch lecture videos.");
        return; 
    }

    const titleLabel = document.getElementById('videoModalLabel');
    if (video && titleLabel) {
        titleLabel.innerText = title;
        video.src = src;
        video.load();
        video.play();

        const playBtnIcon = document.getElementById('playBtn');
        if (playBtnIcon) playBtnIcon.className = "fas fa-pause";
        
        const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
        videoModal.show();
    }
}

function togglePlay() {
    const icon = document.getElementById('playBtn');
    if (video.paused) { 
        video.play(); 
        icon.className = "fas fa-pause"; 
    } else { 
        video.pause(); 
        icon.className = "fas fa-play"; 
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
                alert("Access Restricted: Access Restricted: Please log in to download the modules.");
            }
        });
    });
});