async function automateLatestResources() {
    try {
        const response = await fetch('https://plsp-engg-insights-repository.onrender.com/api/resources/latest');
        const data = await response.json();

        const videoTitle = document.getElementById('latest-video-title');
        const videoDesc = document.getElementById('latest-video-desc');
        const videoBtn = document.getElementById('latest-video-link'); 

        if (data.latestVideo) {
            const videoTitle = data.latestVideo.title;
            const videoUrl = `https://plsp-engg-insights-repository.onrender.com${data.latestVideo.file_url}`; 
    
            document.getElementById('latest-video-title').innerText = videoTitle;
            document.getElementById('latest-video-desc').innerText = data.latestVideo.description;

            const watchBtn = document.querySelector('.btn-watch');
            watchBtn.setAttribute('onclick', `openVideo('${videoUrl}', '${videoTitle.replace(/'/g, "\\'")}')`);
        } else {
            videoTitle.innerText = "No Videos Yet";
            videoDesc.innerText = "Check back soon for new video lectures.";
        }

        const pdfTitle = document.getElementById('latest-pdf-title');
        const pdfDesc = document.getElementById('latest-pdf-desc');
        const pdfLink = document.getElementById('latest-pdf-link');

        if (data.latestPdf) {
            pdfTitle.innerText = data.latestPdf.title;
            pdfDesc.innerText = data.latestPdf.description || "New PDF module available.";
            if (pdfLink) pdfLink.href = `https://plsp-engg-insights-repository.onrender.com${data.latestPdf.file_url}`;
        } else {
            pdfTitle.innerText = "No Modules Yet";
            pdfDesc.innerText = "Check back soon for new PDF modules.";
        }
    } catch (error) {
        console.error("Failed to fetch latest resources:", error);
    }
}

document.addEventListener("DOMContentLoaded", automateLatestResources);