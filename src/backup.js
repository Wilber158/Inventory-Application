async function loadContent() {
    try {
        const sidebarResponse = await fetch('./sidebar.html');
        const sidebarContent = await sidebarResponse.text();
        document.getElementById('sidebar-container').innerHTML = sidebarContent;
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }

}

const table = document.getElementById('dataTable');
const submitButton = document.getElementById('submitButton');
let currentData = [];
let currentlyEditingRow = null;



document.addEventListener('DOMContentLoaded', () => {
    const fileSelectBtn = document.getElementById('addButton');
    const addButton = document.getElementById('addButton');
    const fileInput = document.getElementById('fileInput');
    

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
    if (!file || !file.type.match('text/csv')) {
        alert('Please provide a CSV file.');
        return;
    }

    // Read the CSV file
    let csvData = parseCSV(file.path);
    // Send the CSV data to main process via IPC for further processing
    ipcRenderer.send('process-csv', csvData);
}





window.onload = loadContent;