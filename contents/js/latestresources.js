async function automateLatestResources() {
    try {
        const response = await fetch('/api/resources/latest');
        
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const videoTitle = document.getElementById('latest-video-title');
        const videoDesc = document.getElementById('latest-video-desc');
        const videoBtn = document.getElementById('latest-video-btn'); 

        if (data.latestVideo) {
            videoTitle.innerText = data.latestVideo.title;
            videoDesc.innerText = data.latestVideo.description || "New video lecture available.";
            
            if (videoBtn) {
                videoBtn.onclick = () => {
                    openVideo(data.latestVideo.file_url, data.latestVideo.title);
                };
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
            
            if (pdfLink) {
                pdfLink.href = data.latestPdf.file_url;
                pdfLink.target = "_blank"; 
            }
        } else {
            pdfTitle.innerText = "No Modules Yet";
            pdfDesc.innerText = "Check back soon for new PDF modules.";
        }
    } catch (error) {
        console.error("Failed to fetch latest resources:", error);
    }
}

document.addEventListener("DOMContentLoaded", automateLatestResources);