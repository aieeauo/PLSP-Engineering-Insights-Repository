async function updateAnalytics() {
    try {
        const response = await fetch('http://localhost:5000/api/analytics');
        const data = await response.json();
        
        if (document.getElementById('pdf-count')) {
            document.getElementById('pdf-count').innerText = data.pdfCount;
        }
        if (document.getElementById('video-count')) {
            document.getElementById('video-count').innerText = data.videoCount;
        }
        if (document.getElementById('total-resources')) {
            document.getElementById('total-resources').innerText = `${data.total}+`;
        }
    } catch (error) {
        console.error("Error fetching live analytics:", error);
    }
}

document.addEventListener("DOMContentLoaded", updateAnalytics);