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



window.electronAPI.get_Deleted_Inventory_Entries_Response((event, response) => {
    if (response.error) {
        console.log("Error:", response.error);
    } else {
        console.log("Current data has been set to result of search function");
        renderTable(response);
    }
});



document.addEventListener('DOMContentLoaded', async() => {
    //on load get deleted inventory entries
    try{
        await window.electronAPI.get_Deleted_Inventory_Entries();
        console.log("Response from get_Deleted_Inventory_Entries: ", response);
    }catch(err){
        console.log(err);
    }
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
        console.log("inventory_entry_id: ", item.inventory_entry_id);
        row.dataset.index = item.inventory_entry_id;
        
        // Mapping data to table columns
        let part_prefix = item.part_prefix
        const cellPartPrefix = row.insertCell();
        cellPartPrefix.textContent = part_prefix;
        cellPartPrefix.setAttribute('name', 'part_prefix');
        set.part_prefix = part_prefix;

        let part_number = item.part_number;
        const cellPartNumber = row.insertCell();
        cellPartNumber.textContent = part_number;
        cellPartNumber.setAttribute('name', 'part_number');
        set.part_number = part_number;

        let part_type = item.part_type;
        const cellPartType = row.insertCell();
        cellPartType.textContent = part_type;
        cellPartType.setAttribute('name', 'part_type');
        set.part_type = part_type;

        const cellQuantity = row.insertCell();
        cellQuantity.textContent = item.quantity;
        cellQuantity.setAttribute('name', 'quantity');
        set.quantity = item.quantity;

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

        const cellCondition = row.insertCell();
        let condition = item.condition;
        cellCondition.textContent = condition;
        cellCondition.setAttribute('name', 'condition');
        set.condition = condition;

        const cellManufacturer = row.insertCell();
        let manufacturer = item.manufacturer;
        cellManufacturer.textContent = manufacturer;
        cellManufacturer.setAttribute('name', 'manufacturer');
        set.manufacturer = manufacturer;

        const cellVendor = row.insertCell();
        let vendor_name = item.vendor_name;
        cellVendor.textContent = vendor_name;
        cellVendor.setAttribute('name', 'vendor_name');
        set.vendor_name = vendor_name;

        const cellUnitCost = row.insertCell();
        let unit_cost = item.unit_cost;
        cellUnitCost.textContent = unit_cost;
        cellUnitCost.setAttribute('name', 'unit_cost');
        set.unit_cost = unit_cost;

        const cellEntryNotes = row.insertCell();
        let entry_notes = item.entry_notes;
        cellEntryNotes.textContent = entry_notes;
        cellEntryNotes.setAttribute('name', 'entry_notes');
        set.entry_notes = entry_notes;
        
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
            deleteRow(row); // Pass the item data to the deleteRow function
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
    data.inventory_entry_id = row.dataset.index;
    try{
        await window.electronAPI.update_Inventory_Entry(data);
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

async function deleteRow(row) {
    console.log("row being deleted: ", row);
    console.log("row.dataset.index: ", row.dataset.index);
    const inventoryEntryId = row.dataset.index;
    // Assuming you have a  window.electronAPI.deleteInventoryEntry
    try{
        console.log("Deleting inventory entry with id: ", inventoryEntryId)
        await window.electronAPI.deleteInventoryEntry(inventoryEntryId);
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);
        currentData.splice(rowIndex, 1);
        console.log("Current data after deletion: ", currentData);
        row.remove();
    } catch (err) {
        console.log(err);
    }
    if(currentlyEditingRow === row){
        currentlyEditingRow = null;
    }
}

function editRow(row) {
    // If there's already a row being edited, restore its original values before editing another row
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