async function automateLatestResources() {
    try {
        const response = await fetch('http://localhost:5000/api/resources');
        const data = await response.json();

        if (data.latestVideo) {
            document.getElementById('latest-video-title').innerText = data.latestVideo.title;
            document.getElementById('latest-video-desc').innerText = data.latestVideo.description || "New video lecture available.";
            const videoLink = document.getElementById('latest-video-link');
            videoLink.setAttribute('onclick', `openVideo('http://localhost:5000${data.latestVideo.file_url}', '${data.latestVideo.title}')`);
        }

        if (data.latestPdf) {
            document.getElementById('latest-pdf-title').innerText = data.latestPdf.title;
            document.getElementById('latest-pdf-desc').innerText = data.latestPdf.description || "New PDF module available.";
            document.getElementById('latest-pdf-link').href = `http://localhost:5000${data.latestPdf.file_url}`;
        }
    } catch (error) {
        console.error("Failed to fetch latest resources:", error);
    }
}

document.addEventListener("DOMContentLoaded", automateLatestResources);