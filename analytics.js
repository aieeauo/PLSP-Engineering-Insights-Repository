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
            totalCount += count; 

            document.getElementById(folder.elementId).innerText = `${count}+`;
        } catch (error) {
            console.error(`Error fetching ${folder.path}:`, error);
            document.getElementById(folder.elementId).innerText = "---";
        }
    }

    const totalElement = document.getElementById('total-resources');
    if (totalElement) {
        totalElement.innerText = totalCount;
    }
}

document.addEventListener("DOMContentLoaded", updateAnalytics);