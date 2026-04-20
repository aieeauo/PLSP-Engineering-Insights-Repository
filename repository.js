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
    const userRole = localStorage.getItem('userRole') || 'guest';

    if (userRole === 'guest') {
        alert("Access Restricted: Please log in to your Student or Instructor portal to watch lecture videos.");
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
                alert("Access Restricted: Please log in to your Student or Instructor portal to watch lecture videos.");
            }
        });
    });
});