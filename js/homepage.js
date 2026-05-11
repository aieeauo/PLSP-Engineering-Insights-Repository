document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole') || 'guest';
    
    if (userName) {
        const welcomeElement = document.getElementById('user-name-display');
        if (welcomeElement) welcomeElement.innerText = userName;
    }

    const myModalEl = document.getElementById('videoModal');
    if (myModalEl) {
        myModalEl.addEventListener('hidden.bs.modal', () => stopVideo());
    }

    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (userRole === 'guest') {
                e.preventDefault();
                alert("Access Restricted: Please log in to download modules.");
                window.location.href = '/portalaccess';
            }
        });
    });

    document.querySelectorAll('.btn-watch').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (userRole === 'guest') {
                e.preventDefault();
                alert("Access Restricted: Please log in to watch lecture videos.");
                window.location.href = '/portalaccess';
            }
        });
    });
});

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
            videoPlayer.play().catch(err => console.log("Auto-play blocked:", err));
        }
    }
}

function stopVideo() {
    const videoPlayer = document.getElementById('modalVideoPlayer');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = ""; 
    }
}

function updateTimeDisplay() {
    const video = document.getElementById('modalVideoPlayer');
    const timeDisplay = document.getElementById('videoTime');
    if (video && timeDisplay) {
        const current = Math.floor(video.currentTime);
        const duration = Math.floor(video.duration);
        timeDisplay.innerText = `${current}s / ${duration}s`;
    }
}