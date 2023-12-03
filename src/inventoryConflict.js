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
const submitButton = document.getElementById('submitButton');
const conflictTable = document.getElementById('conflictsTable');
renderConflictTable(staticData2)

// Function to render the conflictTable////////////////////////////////////////////////////////////////////////////////
function renderConflictTable(data) {
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
        editBtn.onclick = function () {
            editConflictRow(item.Part);
        };

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function () {
            deleteRow(item.Part, row);
        };

        cell3.appendChild(editBtn);
        cell3.appendChild(deleteBtn);
    });
}

function editConflictRow(id) {
    const row = findConflictRowById(id);
    const originalLocation = row.cells[1].textContent;

    const editedLocationInput = createInput(originalLocation);

    row.cells[1].innerHTML = '';
    row.cells[1].appendChild(editedLocationInput);

    document.addEventListener('keydown', function onKeyPress(event) {
        if (event.key === 'Enter') {
            applyConflictChanges(id, editedLocationInput.value);
            document.removeEventListener('keydown', onKeyPress);
        } else if (event.key === 'Escape') {
            row.cells[1].textContent = originalLocation;
            document.removeEventListener('keydown', onKeyPress);
        }
    });
}

function applyConflictChanges(id, editedLocation) {
    const editedItem = staticData2.find(item => item.Part === id);

    if (editedItem) {
        editedItem.Location = editedLocation;

        const rowIndex = staticData2.indexOf(editedItem);
        const row = conflictTable.rows[rowIndex + 1];
        row.cells[1].textContent = editedLocation;
    }
}

// Event listener for submit button
submitButton.addEventListener('click', function () {
    // Get input values
    const partNumber = document.getElementById('partNumber').value.toLowerCase();
    const type = document.getElementById('type').value.toLowerCase();
    const totalQuantity = document.getElementById('totalQuantity').value.toLowerCase();

    // Filter the data based on input values
    const filteredData = staticData.filter(item =>
        item.Quantity.toLowerCase().includes(partNumber) ||
        item.Location.toLowerCase().includes(type) ||
        item.Manufacturer.toLowerCase().includes(totalQuantity)
    );

    // Update the table with filtered data
    renderConflictTable(filteredData);
});


function createInput(value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    return input;
}

function deleteRow(id, row) {
    // Implement delete logic here
    console.log('Delete row with ID ' + id);

    // Remove the row visually from the HTML table
    row.remove();
}

function findConflictRowById(id) {
    // Find the row index in the HTML table
    const editedItem = staticData2.find(item => item.Part === id);
    const rowIndex = staticData2.indexOf(editedItem);

    // Get the corresponding row in the HTML table
    return conflictTable.rows[rowIndex + 1]; // Adding 1 to compensate for the header row
}
