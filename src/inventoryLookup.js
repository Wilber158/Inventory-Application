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

window.electronAPI.get_Inventory_Entries_Response((event, response) => {
    if (response.error) {
        console.log("Error:", response.error);
    } else {
        currentData = response;
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
                prefix: document.getElementById('prefix').value,
                partNumber: document.getElementById('partNumber').value,
                type: document.getElementById('type').value,
                quantity: document.getElementById('quantity').value,
            };


            for (const property in formData) {
                console.log(`${property}: ${formData[property]}`);
            }

            // Send the form data to the main process
            await window.electronAPI.get_Inventory_Entries(formData);

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
        const row = tableBody.insertRow();
        
        // Mapping data to table columns
        let partNumber = item.part_prefix + '' + item.part_number;
        const cellPartNumber = row.insertCell();
        cellPartNumber.textContent = partNumber;

        const cellType = row.insertCell();
        cellType.textContent = item.part_type;

        const cellQuantity = row.insertCell();
        cellQuantity.textContent = item.quantity;

        const cellLocation = row.insertCell();
        const location = item.warehouse_name + ' ' + item.zone_name;
        cellLocation.textContent = location; // Adjust this if there's a specific location field

        const cellCondition = row.insertCell();
        cellCondition.textContent = item.condition;

        const cellManufacturer = row.insertCell();
        cellManufacturer.textContent = item.manufacturer;

        const cellVendor = row.insertCell();
        cellVendor.textContent = item.vendor_name;

        const cellUnitCost = row.insertCell();
        cellUnitCost.textContent = item.unit_cost;

        const cellEntryNotes = row.insertCell();
        cellEntryNotes.textContent = item.entry_notes;

        // Edit and Delete buttons
        const btnCell = row.insertCell();
        const editBtn = createButton('Edit', 'edit-btn');
        const deleteBtn = createButton('Delete', 'delete-btn');
        btnCell.appendChild(editBtn);
        btnCell.appendChild(deleteBtn);
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

function createInput(value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    return input;
}

function deleteRow(row) {
    const partId = row.cells[0].textContent;
    const index = staticData.findIndex(item => item.Part == partId);
    if (index > -1) {
        staticData.splice(index, 1);
    }
    row.remove();
}
