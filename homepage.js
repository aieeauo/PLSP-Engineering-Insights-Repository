/**
 * @param {string} videoSrc 
 * @param {string} videoTitle
 */
function openVideo(videoSrc, videoTitle) {
    const player = document.getElementById('modalVideoPlayer');
    const titleLabel = document.getElementById('videoModalLabel');

    if (player) {
        titleLabel.innerText = videoTitle;
        
        player.src = videoSrc;
        
        player.load();
        player.play();
    }
}

function openVideo(src, title) {
    const player = document.getElementById('modalVideoPlayer');
    const titleLabel = document.getElementById('videoModalLabel');

    titleLabel.innerText = title;
    player.src = src;
    player.load();
    player.play();
    
    document.getElementById('playBtn').className = "fas fa-pause";
}

const video = document.getElementById('modalVideoPlayer');

function openVideo(src, title) {
    document.getElementById('videoModalLabel').innerText = title;
    video.src = src;
    video.load();
    video.play();
}

function togglePlay() {
    const icon = document.getElementById('playBtn');
    if (video.paused) { video.play(); icon.className = "fas fa-pause"; } 
    else { video.pause(); icon.className = "fas fa-play"; }
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
    if (video.requestFullscreen) video.requestFullscreen();
}

function stopVideo() {
    video.pause();
    video.src = "";
}

const player = document.getElementById('modalVideoPlayer');
const timeDisplay = document.getElementById('videoTime');

player.onloadedmetadata = function() {
    updateTimeDisplay();
};

player.ontimeupdate = function() {
    updateTimeDisplay();
};

function updateTimeDisplay() {
    const current = formatTime(player.currentTime);
    const total = formatTime(player.duration);
    timeDisplay.innerText = `${current} / ${total}`;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

document.addEventListener("DOMContentLoaded", function () {
    const myModalEl = document.getElementById('videoModal');

    if (myModalEl) {
        myModalEl.addEventListener('hidden.bs.modal', function () {
            const player = document.getElementById('modalVideoPlayer');
            player.pause();
            player.src = "";
        });
    }
});