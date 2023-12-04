async function loadContent() {
    try {
        const sidebarResponse = await fetch('./sidebar.html');
        const sidebarContent = await sidebarResponse.text();
        document.getElementById('sidebar-container').innerHTML = sidebarContent;
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fileSelectBtn = document.getElementById('addButton');
    const fileInput = document.getElementById('fileInput');

    fileSelectBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const directory = fileInput.files;
        handleDirectorySelection(directory);
    });
});

function handleDirectorySelection(directory) {
    if (!directory.length) {
        alert('Please select a directory.');
        return;
    }

    // Send the directory path to the main process
    // Assuming the directory's path is in the first file's path attribute
    window.electronAPI.copy_directory(directory);
}

window.onload = loadContent;
