async function updateAnalytics() {
    try {
        const response = await fetch('https://plsp-engg-insights-repository.onrender.com/api/resources');
        const resources = await response.json();

        const pdfCount = resources.filter(r => r.resource_type === 'pdf').length;
        const videoCount = resources.filter(r => r.resource_type === 'video').length;
        const totalCount = resources.length;

        if (document.getElementById('pdf-count')) {
            document.getElementById('pdf-count').innerText = pdfCount;
        }
        if (document.getElementById('video-count')) {
            document.getElementById('video-count').innerText = videoCount;
        }
        if (document.getElementById('total-resources')) {
            document.getElementById('total-resources').innerText = totalCount;
        }
    } catch (error) {
        console.error("Error fetching live analytics:", error);
    }
}

document.addEventListener("DOMContentLoaded", updateAnalytics);