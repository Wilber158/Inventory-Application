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

const staticData = [
    { Part: 1, Quantity: 'Item 1', Location: 'Description 1', Manufacturer: 'LG', Seller: 'Verizon', UnitCost: '5%', Random:'12', other:'67',more:'99' },
    { Part: 2, Quantity: 'Item 2', Location: 'Description 2', Manufacturer: 'dd', Seller: 'Ven', UnitCost: '6$' , Random:'123', other:'678',more:'999' },
    // ... more static data ...
];

function afterCsvContentLoaded() {
    const table = document.getElementById('dataTable');
    if (table) {
        renderTable(staticData);
        table.addEventListener('click', onTableClick);
    }
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
        Object.values(item).forEach(text => {
            const cell = row.insertCell();
            cell.textContent = text;
        });

        // Add edit and delete buttons
        const editBtn = document.createElement('span');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        const btnCell = row.insertCell();
        btnCell.appendChild(editBtn);
        btnCell.appendChild(deleteBtn);
    });
}

function onTableClick(event) {
    const target = event.target;
    const row = target.closest('tr');

    if (target.classList.contains('edit-btn')) {
        editRow(row);
    } else if (target.classList.contains('delete-btn')) {
        deleteRow(row);
    }
}

function editRow(row) {
    const originalValues = [];
    for (let i = 1; i < row.cells.length - 1; i++) {
        originalValues[i] = row.cells[i].textContent;
        const input = createInput(row.cells[i].textContent);
        row.cells[i].innerHTML = '';
        row.cells[i].appendChild(input);

        if (i === 1) input.focus();

        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                applyChanges(row);
                removeInputEventListeners(row);
            } else if (event.key === 'Escape') {
                restoreOriginalValues(row, originalValues);
                removeInputEventListeners(row);
            }
        });
    }
}

function applyChanges(row) {
    for (let i = 1; i < row.cells.length - 1; i++) {
        const input = row.cells[i].querySelector('input');
        row.cells[i].textContent = input.value;
        // Update staticData or other data sources as necessary
    }
}

function removeInputEventListeners(row) {
    for (let i = 1; i < row.cells.length - 1; i++) {
        const input = row.cells[i].querySelector('input');
        if (input) {
            input.removeEventListener('keydown', arguments.callee);
        }
    }
}

function restoreOriginalValues(row, originalValues) {
    for (let i = 1; i < row.cells.length - 1; i++) {
        row.cells[i].textContent = originalValues[i];
    }
}

function deleteRow(row) {
    // Implement delete logic here
    console.log('Delete row with ID ' + row.cells[0].textContent);

    // Remove the row visually from the HTML table
    row.remove();
}


function findRowById(id) {
    // Find the row index in the HTML table
    const editedItem = staticData.find(item => item.Part === id);
    const rowIndex = staticData.indexOf(editedItem);

    // Get the corresponding row in the HTML table
    return table.rows[rowIndex + 1]; // Adding 1 to compensate for the header row
}

function createInput(value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    return input;
}


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

// Ensure window.onload is set to loadContent
window.onload = loadContent;