async function loadSidebar() {
    try {
        const response = await fetch('./sidebar.html');
        const content = await response.text();
        document.getElementById('sidebar-container').innerHTML = content;
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }
}

window.onload = loadSidebar;

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('fileInput');
    const fileSelectBtn = document.getElementById('fileSelectBtn');
    const addButton = document.getElementById('addButton');

    dropZone.addEventListener('dragover', (event) => {
        event.stopPropagation();
        event.preventDefault();
        // Add style to drop zone
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (event) => {
        event.stopPropagation();
        event.preventDefault();
        // Remove style from drop zone
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (event) => {
        event.stopPropagation();
        event.preventDefault();
        dropZone.classList.remove('dragover');
        const file = event.dataTransfer.files[0];
        handleFile(file);
    });

    fileSelectBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        handleFile(file);
    });

    addButton.addEventListener('click', () => {
        // Trigger IPC event to main process to add the inventory entry
        ipcRenderer.send('add-inventory-entry', {/* CSV Data or file path */});
    });
});

function handleFile(file) {
    if (!file || file.type !== 'text/csv') {
        alert('Please provide a CSV file.');
        return;
    }

    // Read the CSV file
    let csvData = parseCSV(file.path);
    // Send the CSV data to main process via IPC for further processing
    ipcRenderer.send('process-csv', csvData);
}


// Listening for the response from main process
ipcRenderer.on('process-csv-response', (event, { success, error }) => {
    if (success) {
        console.log('CSV processed successfully');
        // Do something on success
    } else {
        console.error('Error processing CSV:', error);
        // Display error message to the user
    }
});
