async function loadContent() {
    try {
        const sidebarResponse = await fetch('./sidebar.html');
        const sidebarContent = await sidebarResponse.text();
        document.getElementById('sidebar-container').innerHTML = sidebarContent;
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }

    try {
        const csvResponse = await fetch('./csvTable.html');
        const csvContent = await csvResponse.text();
        document.getElementById('csv-container').innerHTML = csvContent;
        afterCsvContentLoaded();
    } catch (error) {
        console.error('Failed to load CSV table:', error);
    }
}

function afterCsvContentLoaded() {
    // Example static data array
    const staticData = [
        { Part: 1, Quantity: 'Item 1', Location: 'Description 1', Manufacturer: 'LG', Seller: 'Verizon', UnitCost: '5%', Random:'12', other:'67',more:'99' },
        { Part: 2, Quantity: 'Item 2', Location: 'Description 2', Manufacturer: 'dd', Seller: 'Ven', UnitCost: '6$' , Random:'123', other:'678',more:'999' },
        // ... more static data ...
    ];

    const table = document.getElementById('dataTable');
    if (table) {
        renderTable(staticData);
    }

    // Attach other event listeners and functionalities that depend on the CSV content
    // ... (like event listeners for addButton, fileInput, etc.) ...
}

function renderTable(data) {
    const table = document.getElementById('dataTable');
    // Clear existing table rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    // Populate the table with data
    data.forEach(item => {
        const row = table.insertRow();
        // Example of populating row cells
        Object.values(item).forEach(text => {
            const cell = row.insertCell();
            cell.textContent = text;
        });

        // Add edit and delete buttons
        const editBtn = document.createElement('span');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.onclick = function () {
            editRow(item.Part);
        };

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function () {
            deleteRow(item.Part, row);
        };

        const btnCell = row.insertCell();
        btnCell.appendChild(editBtn);
        btnCell.appendChild(deleteBtn);
    });
}


// Ensure window.onload is set to loadContent
window.onload = loadContent;

// Rest of your code for handling file inputs, drag-and-drop, etc.
// ... (like handleFile function, IPC communication, etc.) ...


document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('fileInput');
    const fileSelectBtn = document.getElementById('addButton');
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

