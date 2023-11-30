const staticData = [
    { Part: 1, Quantity: 'Item 1', Location: 'Description 1', Manufacturer: 'LG', Seller: 'Verizon', UnitCost: '5%' },
    { Part: 2, Quantity: 'Item 2', Location: 'Description 2', Manufacturer: 'dd', Seller: 'Ven', UnitCost: '6$' },
    // ... more static data
];

const submitButton = document.getElementById('submitButton');
// Process the static data and update the HTML
const table = document.getElementById('dataTable');

// Initial rendering of the table
renderTable(staticData);

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

        cell1.textContent = item.Part;
        cell2.textContent = item.Quantity;
        cell3.textContent = item.Location;
        cell4.textContent = item.Manufacturer;
        cell5.textContent = item.Seller;
        cell6.textContent = item.UnitCost;

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

        cell7.appendChild(editBtn);
        cell7.appendChild(deleteBtn);
    });
}

function editRow(id) {
    const row = findRowById(id);

    // Store the original values
    const originalQuantity = row.cells[1].textContent;
    const originalLocation = row.cells[2].textContent;
    const originalManufacturer = row.cells[3].textContent;
    const originalSeller = row.cells[4].textContent;
    const originalUnitCost = row.cells[5].textContent;

    // Create input elements
    const editedQuantityInput = createInput(row.cells[1].textContent);
    const editedLocationInput = createInput(row.cells[2].textContent);

    // Replace cell content with input elements
    row.cells[1].textContent = '';
    row.cells[1].appendChild(editedQuantityInput);
    row.cells[2].textContent = '';
    row.cells[2].appendChild(editedLocationInput);

    

    // Add event listener for the Enter key to apply changes
    document.addEventListener('keydown', function onKeyPress(event) {
        if (event.key === 'Enter') {
            applyChanges(id, editedQuantityInput.value, editedLocationInput.value);
            document.removeEventListener('keydown', onKeyPress); // Remove the event listener
        } else if (event.key === 'Escape') {
            // Restore the original values and remove the event listener
            row.cells[1].textContent = originalQuantity;
            row.cells[2].textContent = originalLocation;
            row.cells[3].textContent = originalManufacturer;
            row.cells[4].textContent = originalSeller;
            row.cells[5].textContent = originalUnitCost
            document.removeEventListener('keydown', onKeyPress); // Remove the event listener
        }
    });
}

function applyChanges(id, editedQuantity, editedLocation) {
    const editedItem = staticData.find(item => item.Part === id);

    if (editedItem) {
        editedItem.Quantity = editedQuantity;
        editedItem.Location = editedLocation;

        // Update the corresponding table cell content
        const rowIndex = staticData.indexOf(editedItem);
        const row = table.rows[rowIndex + 1]; // Adding 1 to compensate for the header row
        row.cells[1].textContent = editedQuantity;
        row.cells[2].textContent = editedLocation;
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
    renderTable(filteredData);
});

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

function deleteRow(id, row) {
    // Implement delete logic here
    console.log('Delete row with ID ' + id);

    // Remove the row visually from the HTML table
    row.remove();
}
