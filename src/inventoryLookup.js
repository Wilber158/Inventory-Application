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
    { Part: 1, Quantity: 'Item 1', Location: 'Description 1', Manufacturer: 'LG', Seller: 'Verizon', UnitCost: '5%' },
    { Part: 2, Quantity: 'Item 2', Location: 'Description 2', Manufacturer: 'dd', Seller: 'Ven', UnitCost: '6$' },
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
    const editedQuantity = prompt('Enter the new quantity:');
    const editedLocation = prompt('Enter the new location:');

    if (editedQuantity !== null && editedLocation !== null) {
        // Find the item in staticData array with the matching id
        const editedItem = staticData.find(item => item.Part === id);

        if (editedItem) {
            // Update the values in the staticData array
            editedItem.Quantity = editedQuantity;
            editedItem.Location = editedLocation;

            // Update the corresponding table cell content
            const rowIndex = staticData.indexOf(editedItem);
            const row = table.rows[rowIndex + 1]; // Adding 1 to compensate for the header row
            row.cells[1].textContent = editedQuantity;
            row.cells[2].textContent = editedLocation;
        }
    }
}

function deleteRow(id, row) {
    // Implement delete logic here
    console.log('Delete row with ID ' + id);

    // Remove the row visually from the HTML table
    row.remove();
}
