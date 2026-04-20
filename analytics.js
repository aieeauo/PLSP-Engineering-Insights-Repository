async function updateAnalytics() {
    const username = "aieeauo"; 
    const repo = "PLSP-Engineering-Insights-Repository";
    
    const folders = [
        { path: 'assets/modules', elementId: 'pdf-count' },
        { path: 'assets/videos', elementId: 'video-count' }
    ];

    let totalFiles = 0;

    for (const folder of folders) {
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder.path}`);
            const data = await response.json();
            
            const count = Array.isArray(data) ? data.length : 0;
            totalFiles += count;

            document.getElementById(folder.elementId).innerText = `${count}`;
        } catch (error) {
            console.error(`Error counting ${folder.path}:`, error);
            document.getElementById(folder.elementId).innerText = "150+"; 
        }
    }

    const totalElement = document.getElementById('total-resources');
    if (totalElement) {
        totalElement.innerText = totalFiles > 0 ? `${totalFiles}+` : "0";
    }
}

document.addEventListener("DOMContentLoaded", updateAnalytics);