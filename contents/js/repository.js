document.addEventListener("DOMContentLoaded", fetchResources);

document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        const welcomeElement = document.getElementById('user-name-display');
        if (welcomeElement) welcomeElement.innerText = userName;
    }
});

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