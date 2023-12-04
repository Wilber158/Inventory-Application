async function loadContent() {
    try {
        const sidebarResponse = await fetch('./sidebar.html');
        const sidebarContent = await sidebarResponse.text();
        document.getElementById('sidebar-container').innerHTML = sidebarContent;
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }
}

const directoryDiv = document.getElementById('directory');

document.getElementById('addButton').addEventListener('click', () => {
    window.electronAPI.selectDirectory();
});

window.electronAPI.onDirectorySelected((event, paths) => {
    console.log('Selected directory:', paths[0]);
    // Do something with the selected directory path
    directoryDiv.innerHTML = paths[0];

    try{
        window.electronAPI.copy_file(paths[0])
        .then(result => {
            if (result.success) {
                console.log('File copied successfully');
            } else {
                console.error('Error copying file:', result.message);
            }
        })
        .catch(err => {
            console.error('Error:', err);
        });

    }catch(err){
        console.error('Error:', err);
    }
});




window.onload = loadContent;
