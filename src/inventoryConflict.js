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

const staticData2 = [
    { Part: 1, Quantity: 'Item 1', Location: 'Description 1'},
    { Part: 2, Quantity: 'Item 2', Location: 'Description 2' },
    // ... more static data
];

document.addEventListener('DOMContentLoaded', () => {
    const conflictTable = document.getElementById('conflictsTable');
    if (conflictTable) {
        renderConflictTable(staticData2);
        conflictTable.addEventListener('click', onConflictTableClick);
    }

    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function() {
        const partNumber = document.getElementById('partNumber').value.toLowerCase();
        const type = document.getElementById('type').value.toLowerCase();
        const totalQuantity = document.getElementById('totalQuantity').value.toLowerCase();

        const filteredData = staticData2.filter(item =>
            item.Quantity.toLowerCase().includes(partNumber) ||
            item.Location.toLowerCase().includes(type)
        );

        renderConflictTable(filteredData);
    });
});


// Function to render the conflictTable////////////////////////////////////////////////////////////////////////////////
function renderConflictTable(data) {
    const conflictTable = document.getElementById('conflictsTable');

    // Clear existing table rows
    while (conflictTable.rows.length > 1) {
        conflictTable.deleteRow(1);
    }

    // Populate the table with data
    data.forEach(item => {
        const row = conflictTable.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent = item.Part;
        cell2.textContent = item.Location;

        const editBtn = document.createElement('span');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        cell3.appendChild(editBtn);
        cell3.appendChild(deleteBtn);
    });
}

function onConflictTableClick(event) {
    const target = event.target;
    const row = target.closest('tr');

    if (target.classList.contains('edit-btn')) {
        editConflictRow(row);
    } else if (target.classList.contains('delete-btn')) {
        deleteRow(row);
    }
}

function editConflictRow(row) {
    const originalValues = [];
    for (let i = 1; i < row.cells.length - 1; i++) {
        originalValues[i] = row.cells[i].textContent;
        const input = createInput(row.cells[i].textContent);
        row.cells[i].innerHTML = '';
        row.cells[i].appendChild(input);

        if (i === 1) input.focus();

        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                applyConflictChanges(row);
                removeInputEventListeners(row);
            } else if (event.key === 'Escape') {
                restoreOriginalValues(row, originalValues);
                removeInputEventListeners(row);
            }
        });
    }
}

function applyConflictChanges(row) {
    for (let i = 1; i < row.cells.length - 1; i++) {
        const input = row.cells[i].querySelector('input');
        row.cells[i].textContent = input.value;
        // Update staticData2 or other data sources as necessary
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
    const index = staticData2.findIndex(item => item.Part == partId);
    if (index > -1) {
        staticData2.splice(index, 1);
    }
    row.remove();
    console.log('Deleted row with Part ID:', partId);
}
