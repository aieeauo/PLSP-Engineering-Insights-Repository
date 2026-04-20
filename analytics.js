async function updateAnalytics() {
    const username = "aieeauo"; 
    const repo = "PLSP-Engineering-Insights-Repository";
    
    const folders = [
        { path: 'assets/modules', elementId: 'pdf-count' },
        { path: 'assets/videos', elementId: 'video-count' }
    ];

    let totalCount = 0;

    for (const folder of folders) {
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder.path}`);
            const data = await response.json();
            
            const count = Array.isArray(data) ? data.length : 0;
            totalCount += count; // Add to the running total

            document.getElementById(folder.elementId).innerText = `${count}+`;
        } catch (error) {
            console.error(`Error fetching ${folder.path}:`, error);
            // Optional: Static fallback if the API fails
            document.getElementById(folder.elementId).innerText = "---";
        }
    }

    // Update the Total Resources card with the sum
    const totalElement = document.getElementById('total-resources');
    if (totalElement) {
        totalElement.innerText = totalCount;
    }
}

document.addEventListener("DOMContentLoaded", updateAnalytics);