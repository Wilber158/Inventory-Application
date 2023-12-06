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
let lastEditedRow = null;


window.electronAPI.get_CSV_Data_Response((event, response) => {
    if (response.error) {
        console.log("Error:", response.error);
    } else {
        console.log("Current data has been set to result of CSV parsing function");
        renderTable(response);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('fileInput');
    const fileSelectBtn = document.getElementById('addButton');
    const addButton = document.getElementById('addButton');
    const confirmButton = document.getElementById('confirmButton');

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

    addButton.addEventListener('click', (event) => {
        
    });

    confirmButton.addEventListener('click', (event) => {
        // Send the currentData array to main process via IPC for further processing

        window.electronAPI.auto_Add_Entry(currentData);

    
    });

    
});

async function handleFile(file) {
    //return if not a csv file
    if (!file.endsWith('.csv')) {
        return;
    }

    document.getElementById('drop-zone').innerHTML = file;
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


document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if(!currentlyEditingRow){
            return;
        }
        //add the elements in the row to the currentData array
        applyChanges(currentlyEditingRow);
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
    data.forEach((item, index) => {
        let set = {};
        const row = tableBody.insertRow();
        row.dataset.index = index;
        
        // Mapping data to table columns
        let partPrefix = item['Part Prefix']
        const cellPartPrefix = row.insertCell();
        cellPartPrefix.textContent = partPrefix;
        set.partPrefix = partPrefix;

        let partNumber = item['Part Number'];
        const cellPartNumber = row.insertCell();
        cellPartNumber.textContent = partNumber;
        set.partNumber = partNumber;

        const cellType = row.insertCell();
        cellType.textContent = item['Part Type'];
        set.type = item['Part Type'];

        const cellQuantity = row.insertCell();
        cellQuantity.textContent = item['Quantity'];
        set.quantity = item['Quantity'];

        const cellWarehouse = row.insertCell();
        const warehouse = item['Warehouse'];
        cellWarehouse.textContent = warehouse;
        set.warehouse = warehouse;

        const cellZone = row.insertCell();
        let zone = item['Zone'];
        cellZone.textContent = zone;
        set.zone = zone;

        const cellCondition = row.insertCell();
        let condition = item['Condition'];
        cellCondition.textContent = condition;
        set.condition = condition;

        const cellManufacturer = row.insertCell();
        let manufacturer = item['Manufacturer'];
        cellManufacturer.textContent = manufacturer;
        set.manufacturer = manufacturer;

        const cellVendor = row.insertCell();
        let vendor_name = item['Vendor Name'];
        cellVendor.textContent = vendor_name;
        set.vendor = vendor_name;

        const cellUnitCost = row.insertCell();
        let unit_cost = item['Unit Cost'];
        cellUnitCost.textContent = unit_cost;
        set.unitCost = unit_cost;

        const cellEntryNotes = row.insertCell();
        let entry_notes = item['Entry Notes'];
        cellEntryNotes.textContent = entry_notes;
        set.entryNotes = entry_notes;
        
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
    if (currentlyEditingRow && currentlyEditingRow !== row) {
        restoreOriginalValues(currentlyEditingRow);
    }

    if (!row.querySelector('input')) { // If row is not in edit mode
        currentlyEditingRow = row;
        lastEditedRow = row;

        // Replace each cell (except the last one with buttons) with an input element
        for (let i = 0; i < row.cells.length - 1; i++) {
            const cellValue = row.cells[i].textContent;
            const input = createInput(cellValue);
            row.cells[i].innerHTML = '';
            row.cells[i].appendChild(input);
        }
    }
}


//reflect changes in table and currentData array
function applyChanges(row) {
    console.log("Current Data before changes: ", currentData)
    const index = row.dataset.index; 
    const editedData = currentData[index]; 

    for (let i = 0; i < row.cells.length - 1; i++) {
        const input = row.cells[i].querySelector('input');
        const key = Object.keys(editedData)[i]; 
        editedData[key] = input.value; 
        row.cells[i].textContent = input.value; 
    }
    console.log("Current Data after changes: ", currentData)
    currentlyEditingRow = null; // Reset the currently editing row
}

function removeInputEventListeners(row) {
    for (let i = 0; i < row.cells.length - 1; i++) {
        const input = row.cells[i].querySelector('input');
        if (input) {
            input.removeEventListener('keydown', arguments.callee);
        }
    }
}

function restoreOriginalValues(row) {
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    const originalData = currentData[rowIndex];
    if (originalData) {
        const keys = Object.keys(originalData);
        for (let i = 0; i < keys.length; i++) {
            row.cells[i].textContent = originalData[keys[i]];
        }
    }
    currentlyEditingRow = null;
}

function createInput(value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    return input;
}
//remove the row from the table and the currentData array
function deleteRow(row, item) {
    if(currentlyEditingRow == row){
        currentlyEditingRow = null;
    }
    row.remove();
    console.log("Current Data before deletion: ", currentData)
    let index = row.dataset.index;
    currentlyEditingRow = null;
    currentData[index] = null;
    console.log("Current Data after deletion: ", currentData)
}

window.onload = loadContent;