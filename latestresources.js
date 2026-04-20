async function automateLatestResources() {
    const username = "aieeauo";
    const repo = "PLSP-Engineering-Insights-Repository";

    const sections = [
        {
            path: 'assets/videos',
            titleId: 'latest-video-title',
            descId: 'latest-video-desc',
            linkId: 'latest-video-link',
            type: 'Video'
        },
        {
            path: 'assets/modules',
            titleId: 'latest-pdf-title',
            descId: 'latest-pdf-desc',
            linkId: 'latest-pdf-link',
            type: 'PDF'
        }
    ];

    for (const section of sections) {
        try {

            const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${section.path}`);
            const files = await response.json();

            if (Array.isArray(files) && files.length > 0) {
                const latestFile = files[files.length - 1];
                const cleanTitle = latestFile.name.split('.')[0].replace(/-/g, ' ');

                document.getElementById(section.titleId).innerText = cleanTitle;
                document.getElementById(section.descId).innerText = `New ${section.type} available in the ${section.path.split('/').pop()} folder.`;
                
                const linkElement = document.getElementById(section.linkId);
                if (section.type === 'Video') {
                    linkElement.setAttribute('onclick', `openVideo('${latestFile.download_url}', '${cleanTitle}')`);
                } else {
                    linkElement.href = latestFile.download_url;
                }
            }

        } catch (error) {
            console.error(`Failed to automate ${section.type}:`, error);
        }
    }
}

document.addEventListener("DOMContentLoaded", automateLatestResources);