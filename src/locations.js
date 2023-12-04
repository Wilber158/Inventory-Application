async function loadSidebar() {
    try {
        const response = await fetch('./sidebar.html');
        const content = await response.text();
        document.getElementById('sidebar-container').innerHTML = content;
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }
}

const table = document.getElementById('dataTable');
const submitButton = document.getElementById('submitButton');
const form = document.getElementById('inventoryForm');
window.onload = loadSidebar;
let currentData = [];
let currentlyEditingRow = null;




document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && currentlyEditingRow) {
        restoreOriginalValues(currentlyEditingRow);
        currentlyEditingRow = null; // Reset the currently editing row
    }
});

window.electronAPI.get_locations_Response((event, response) => {
    if (response.error) {
        console.log("Error:", response.error);
    } else {
        console.log("Current data has been set to result of search function");
        renderTable(response);
    }
});



document.addEventListener('DOMContentLoaded', () => {
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        
        // Get values from the form inputs
        if(form.checkValidity()){
            const formData = {
                warehouse_name: document.getElementById('warehouse_name').value,
                partNumber: document.getElementById('zone_name').value,
            };

            for (const property in formData) {
                console.log(`${property}: ${formData[property]}`);
            }

            // Send the form data to the main process
            await window.electronAPI.get_locations(formData);

        } else{
            console.log("Form is not valid")
            form.reportValidity()
        }
    });
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
        const cellPartNumber = row.insertCell();
        cellPartNumber.textContent = item.warehouse_name;
        set.warehouse_name = warehouse_name;

        const cellType = row.insertCell();
        cellType.textContent = item.zone_name;
        set.zone_name = item.zone_name;

        const cellQuantity = row.insertCell();
        cellQuantity.textContent = item.location_notes;
        set.location_notes = item.location_notes;

        const cellLocation = row.insertCell();
        cellLocation.textContent = item.single_part_only; // Adjust this if there's a specific location field
        set.location = location;

        
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
        return; // If no original data found, do nothing
    }

    // Replace input fields with the original data
    const keys = Object.keys(originalData);
    for (let i = 0; i < keys.length; i++) { // Assuming the last key is for the action buttons
        row.cells[i].textContent = originalData[keys[i]];
    }

    currentlyEditingRow = null; // Clear the editing state
}

function createInput(value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    return input;
}

function deleteRow(row, item) {
    // Assuming you have a function window.electronAPI.deleteInventoryEntry
    window.electronAPI.deleteInventoryEntry(item.id, (response) => {
        if (response.error) {
            console.error('Error deleting inventory entry:', response.error);
        } else {
            // Remove the row from the table
            row.remove();
        }
    });
}
