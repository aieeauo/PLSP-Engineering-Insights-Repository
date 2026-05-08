document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        const welcomeElement = document.getElementById('user-name-display');
        if (welcomeElement) welcomeElement.innerText = userName;
    }
});

const video = document.getElementById('modalVideoPlayer');
const timeDisplay = document.getElementById('videoTime');

const myModalEl = document.getElementById('videoModal');
if (myModalEl) {
    myModalEl.addEventListener('hidden.bs.modal', function () {
        stopVideo();
    });
}

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
                window.location.href = 'contents/portalaccess.html';
            }
        });
    });
});