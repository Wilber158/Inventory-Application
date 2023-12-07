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
const submitButton = document.getElementById('submitButton2');
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
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && currentlyEditingRow) {
            restoreOriginalValues(currentlyEditingRow);
            currentlyEditingRow = null; // Reset the currently editing row
        }
    });
    document.addEventListener('keydown', function(event) {
        const activeElement = document.activeElement;
        if (event.key === 'Enter' && currentlyEditingRow && activeElement.tagName === 'INPUT') {
            event.preventDefault(); // Prevent default form submission
            applyChanges(currentlyEditingRow);
            currentlyEditingRow = null; // Reset the currently editing row
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
    data.forEach(item=> {
        let set = {};
        const row = tableBody.insertRow();
        row.dataset.index = item.location_id;
        
        // Mapping data to table columns

        const cellWarehouse = row.insertCell();
        const warehouse_name = item.warehouse_name;
        cellWarehouse.textContent = warehouse_name;
        cellWarehouse.setAttribute('name', 'warehouse_name');
        set.warehouse_name = warehouse_name;

        const cellZone = row.insertCell();
        let zone_name = item.zone_name;
        cellZone.textContent = zone_name;
        cellZone.setAttribute('name', 'zone_name');
        set.zone = zone_name;

        const cellLocation_Notes = row.insertCell();
        let location_notes = item.location_notes;
        cellLocation_Notes.textContent = location_notes;
        cellLocation_Notes.setAttribute('name', 'location_notes');
        set.location_notes = location_notes;

        const cellSingle_Part_Only = row.insertCell();
        let single_part_only = item.single_part_only;
        if(single_part_only == 1){
            single_part_only = "True";
        }
        else if(single_part_only == 0){
            single_part_only = "False";
        }
        cellSingle_Part_Only.textContent = single_part_only
        cellSingle_Part_Only.setAttribute('name', 'single_part_only');
        set.single_part_only = single_part_only;

        
        currentData.push(set);
        // Edit and Delete buttons
        const btnCell = row.insertCell();
        const editBtn = createButton('Edit', 'edit-btn');
        btnCell.appendChild(editBtn);
        // Add event listeners to the edit and delete buttons
        editBtn.addEventListener('click', () => {
            editRow(row, item); // Pass the item data to the editRow function
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

async function applyChanges(row) {
    console.log("Row before apply changes: ", row);
    const data = {};
    for (let i = 0; i < row.cells.length - 1; i++) {
        const input = row.cells[i].querySelector('input');
        row.cells[i].textContent = input.value;
        const cellName = row.cells[i].getAttribute('name');
        data[cellName] = input.value;
    }
    data.location_id = row.dataset.index;
    try{
        console.log("Data to be updated: ", data);
        await window.electronAPI.update_Location_Entry(data);
    }catch(err){
        console.log(err);
    }
    currentlyEditingRow = null; // Clear the editing state
    console.log("Row after apply changes: ", row);
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


function editRow(row) {
    // If there's already a row being edited, restore its original values before editing another row
    if(currentlyEditingRow == row){
        return;
    }
    if (currentlyEditingRow && currentlyEditingRow !== row) {
        restoreOriginalValues(currentlyEditingRow);
    }
    // Set the currently editing row
    currentlyEditingRow = row;

    // Replace each cell (except the last one with buttons) with an input element
    for (let i = 0; i < row.cells.length - 1; i++) {
        const cellValue = row.cells[i].textContent;
        const input = createInput(cellValue);
        row.cells[i].innerHTML = '';
        row.cells[i].appendChild(input);

        if (i === 0) {
            input.focus();
        }
    }
}