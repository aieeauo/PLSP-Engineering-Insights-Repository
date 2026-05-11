async function updateAnalytics() {
    try {
        const response = await fetch('/api/resources');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resources = await response.json();

        const pdfCount = resources.filter(r => r.resource_type === 'pdf').length;
        const videoCount = resources.filter(r => r.resource_type === 'video').length;
        const totalCount = resources.length;

        const pdfEl = document.getElementById('pdf-count');
        const videoEl = document.getElementById('video-count');
        const totalEl = document.getElementById('total-resources');

        if (pdfEl) pdfEl.innerText = pdfCount;
        if (videoEl) videoEl.innerText = videoCount;
        if (totalEl) totalEl.innerText = totalCount;

    } catch (error) {
        console.error("Error fetching live analytics:", error);
        
        const elements = ['pdf-count', 'video-count', 'total-resources'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = "0";
        });
    }
}

document.addEventListener("DOMContentLoaded", updateAnalytics);