async function automateLatestResources() {
    try {
        const response = await fetch('http://localhost:5000/api/resources/latest');
        const data = await response.json();

        const videoTitle = document.getElementById('latest-video-title');
        const videoDesc = document.getElementById('latest-video-desc');
        const videoBtn = document.getElementById('latest-video-link'); 

        if (data.latestVideo) {
            videoTitle.innerText = data.latestVideo.title;
            videoDesc.innerText = data.latestVideo.description || "New video lecture available.";
            if (videoBtn) {
                videoBtn.onclick = () => openVideo(`http://localhost:5000${data.latestVideo.file_url}`, data.latestVideo.title);
            }
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
            if (pdfLink) pdfLink.href = `http://localhost:5000${data.latestPdf.file_url}`;
        } else {
            pdfTitle.innerText = "No Modules Yet";
            pdfDesc.innerText = "Check back soon for new PDF modules.";
        }
    } catch (error) {
        console.error("Failed to fetch latest resources:", error);
    }
}

document.addEventListener("DOMContentLoaded", automateLatestResources);