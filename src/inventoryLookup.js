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


const staticData = [
    { Part: 1, Quantity: 'Item 1', Location: 'Description 1', Manufacturer: 'LG', Seller: 'Verizon', UnitCost: '5%', Random:'12', other:'67',more:'99' },
    { Part: 2, Quantity: 'Item 2', Location: 'Description 2', Manufacturer: 'dd', Seller: 'Ven', UnitCost: '6$' , Random:'123', other:'678',more:'999' },
    // ... more static data
];

// Process the static data and update the HTML
const table = document.getElementById('dataTable');
const submitButton = document.getElementById('submitButton');

// Initial rendering of the table
renderTable(staticData);

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
    renderTable(filteredData);
});

document.addEventListener('keydown', function(e) {
    // Check if 'Ctrl' and 'F' were pressed together
    if (e.ctrlKey && e.key === 'F') {
        document.getElementById('partNumber').focus(); // Focus on your input box
    }
});

// Function to render the table with given data
function renderTable(data) {
    // Clear existing table rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Populate the table with data
    data.forEach(item => {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);
        const cell8 = row.insertCell(7);
        const cell9 = row.insertCell(8);
        const cell10 = row.insertCell(9);

        cell1.textContent = item.Part;
        cell2.textContent = item.Quantity;
        cell3.textContent = item.Location;
        cell4.textContent = item.Manufacturer;
        cell5.textContent = item.Seller;
        cell6.textContent = item.UnitCost;
        cell7.textContent = item.Random;
        cell8.textContent = item.other;
        cell9.textContent = item.more;


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

        cell10.appendChild(editBtn);
        cell10.appendChild(deleteBtn);
    });
}

function deleteRow(id, row) {
    // Implement delete logic here
    console.log('Delete row with ID ' + id);

    // Remove the row visually from the HTML table
    row.remove();
}

function editRow(id) {
    const row = findConflictRowById(id);

    // Store the original values
    const originalLocation = row.cells[2].textContent;
    const originalQuantity = row.cells[1].textContent;

    // Create input elements
    const editedLocationInput = createInput(originalLocation);
    const editedQuantityInput = createInput(originalQuantity);

    // Replace cell content with input elements
    row.cells[2].innerHTML = '';
    row.cells[2].appendChild(editedLocationInput);

    row.cells[1].innerHTML = '';
    row.cells[1].appendChild(editedQuantityInput);

    // Add event listener for the Enter key to apply changes
    document.addEventListener('keydown', function onKeyPress(event) {
        if (event.key === 'Enter') {
            applyChanges(id, editedQuantityInput.value, editedLocationInput.value);
            document.removeEventListener('keydown', onKeyPress); // Remove the event listener
        } else if (event.key === 'Escape') {
            // Restore the original values and remove the event listener
            row.cells[2].textContent = originalLocation;
            row.cells[1].textContent = originalQuantity;
            document.removeEventListener('keydown', onKeyPress); // Remove the event listener
        }
    });
}

function applyChanges(id, editedQuantity, editedLocation) {
    const editedItem = staticData.find(item => item.Part === id);

    if (editedItem) {
        editedItem.Location = editedLocation;
        editedItem.Quantity = editedQuantity;

        // Update the corresponding table cell content
        const rowIndex = staticData.indexOf(editedItem);
        const row = table.rows[rowIndex + 1]; // Adding 1 to compensate for the header row
        row.cells[2].textContent = editedLocation;
        row.cells[1].textContent = editedQuantity;
    }
}

function createInput(value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    return input;
}
function findConflictRowById(id) {
    // Find the row index in the HTML table
    const editedItem = staticData.find(item => item.Part === id);
    const rowIndex = staticData.indexOf(editedItem);

    // Get the corresponding row in the HTML table
    return table.rows[rowIndex + 1]; // Adding 1 to compensate for the header row
}
