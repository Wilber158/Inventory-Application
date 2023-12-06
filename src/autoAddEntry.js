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
const submitButton = document.getElementById('addButton');
let currentData = [];
let currentlyEditingRow = null;


window.electronAPI.get_CSV_Data_Reponse((event, response) => {

});

document.addEventListener('DOMContentLoaded', () => {
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        
        const formData = {
            partNumber: document.getElementById('partNumber').value
        };
        for (const property in formData) {
            console.log(`${property}: ${formData[property]}`);
        }
        // Send the form data to the main process
        await window.electronAPI.get_Inventory_Entries(formData);

    });
});

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('fileInput');
    const fileSelectBtn = document.getElementById('addButton');
    const addButton = document.getElementById('addButton');

    console.log("This runs when file is added");
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
        console.log("File: ", file.path);
        handleFile(file.path);
    });

    fileSelectBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        console.log("File: ", file.path);
        handleFile(file.path);
    });

    addButton.addEventListener('click', () => {
        
    });
});

async function handleFile(file) {

    console.log("Calling get_CSV_Data from main process")
    // Send the CSV data to main process via IPC for further processing
    await window.electronAPI.get_CSV_Data(file);  
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && currentlyEditingRow) {
        restoreOriginalValues(currentlyEditingRow);
        currentlyEditingRow = null; // Reset the currently editing row
    }
});


function renderTable(data) {
    const tableBody = document.getElementById('dataTable').querySelector('tbody');
    // Clear existing table rows
    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }
    console.log("Type of data: " + typeof data)
    // Populate the table with data
    data.forEach(item => {
        let set = {};
        const row = tableBody.insertRow();
        
        // Mapping data to table columns
        let partNumber = item['Part Prefix'] + '' + item['Part Number']
        const cellPartNumber = row.insertCell();
        cellPartNumber.textContent = partNumber;
        set.partNumber = partNumber;

        const cellType = row.insertCell();
        cellType.textContent = item['Part Type'];
        set.type = item['Part Type'];

        const cellQuantity = row.insertCell();
        cellQuantity.textContent = item['Quantity'];
        set.quantity = item['Quantity'];

        const cellLocation = row.insertCell();
        const location = item.warehouse_name + ' ' + item.zone_name;
        cellLocation.textContent = location; // Adjust this if there's a specific location field
        set.location = location;

        const cellCondition = row.insertCell();
        cellCondition.textContent = item.condition;
        set.condition = item.condition;

        const cellManufacturer = row.insertCell();
        cellManufacturer.textContent = item.manufacturer;
        set.manufacturer = item.manufacturer;

        const cellVendor = row.insertCell();
        cellVendor.textContent = item.vendor_name;
        set.vendor = item.vendor_name;

        const cellUnitCost = row.insertCell();
        cellUnitCost.textContent = item.unit_cost;
        set.unitCost = item.unit_cost;

        const cellEntryNotes = row.insertCell();
        cellEntryNotes.textContent = item.entry_notes;
        set.entryNotes = item.entry_notes;
        
        currentData.push(set);
        // Edit and Delete buttons
        const btnCell = row.insertCell();
        const editBtn = createButton('Edit', 'edit-btn');
        const deleteBtn = createButton('Delete', 'delete-btn');
        btnCell.appendChild(editBtn);
        btnCell.appendChild(deleteBtn);
        // Add event listeners to the edit and delete buttons
        editBtn.addEventListener('click', () => {
            editRow(row, item); // Pass the item data to the editRow function
        });

        deleteBtn.addEventListener('click', () => {
            deleteRow(row, item); // Pass the item data to the deleteRow function
        });

    });
}

function createButton(text, className) {
    const btn = document.createElement('span');
    btn.className = className;
    btn.textContent = text;
    return btn;
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
    // If there's already a row being edited, restore its original values before editing another row
    if (currentlyEditingRow && currentlyEditingRow !== row) {
        restoreOriginalValues(currentlyEditingRow);
    }

    // Check if the current row is already in edit mode
    const isEditing = row.querySelector('input');
    if (isEditing) {
        // Row is already in edit mode
        return;
    }

    // Set the currently editing row
    currentlyEditingRow = row;

    // Replace each cell (except the last one with buttons) with an input element
    for (let i = 1; i < row.cells.length - 1; i++) {
        const cellValue = row.cells[i].textContent;
        const input = createInput(cellValue);
        row.cells[i].innerHTML = '';
        row.cells[i].appendChild(input);

        if (i === 0) {
            input.focus();
        }
    }
}



function applyChanges(row) {
    for (let i = 1; i < row.cells.length - 1; i++) {
        const input = row.cells[i].querySelector('input');
        row.cells[i].textContent = input.value;
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

function restoreOriginalValues(row) {
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    const originalData = currentData[rowIndex];
    if (!originalData) {
        return; 
    }

    const keys = Object.keys(originalData);
    for (let i = 0; i < keys.length; i++) { 
        row.cells[i].textContent = originalData[keys[i]];
    }

    currentlyEditingRow = null;
}

function createInput(value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    return input;
}

function deleteRow(row, item) {
    window.electronAPI.deleteInventoryEntry(item.id, (response) => {
        if (response.error) {
            console.error('Error deleting inventory entry:', response.error);
        } else {
            // Remove the row from the table
            row.remove();
        }
    });
}

window.onload = loadContent;