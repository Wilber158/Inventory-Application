const staticData = [
    { id: 1, name: 'Item 1', description: 'Description 1' },
    { id: 2, name: 'Item 2', description: 'Description 2' },
    // ... more static data
];

// Process the static data and update the HTML
const table = document.getElementById('dataTable');

staticData.forEach(item => {
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    cell1.textContent = item.id;
    cell2.textContent = item.name;
    cell3.textContent = item.description;

    const editBtn = document.createElement('span');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.onclick = function () {
        editRow(item.id);
    };

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function () {
        deleteRow(item.id, row);
    };

    cell4.appendChild(editBtn);
    cell4.appendChild(deleteBtn);
});

function editRow(id) {
    const editedName = prompt('Enter the new name:');
    const editedDescription = prompt('Enter the new description:');

    if (editedName !== null && editedDescription !== null) {
        // Find the item in staticData array with the matching id
        const editedItem = staticData.find(item => item.id === id);

        if (editedItem) {
            // Update the values in the staticData array
            editedItem.name = editedName;
            editedItem.description = editedDescription;

            // Update the corresponding table cell content
            const rowIndex = staticData.indexOf(editedItem);
            const row = table.rows[rowIndex + 1]; // Adding 1 to compensate for the header row
            row.cells[1].textContent = editedName;
            row.cells[2].textContent = editedDescription;
        }
    }
}

function deleteRow(id, row) {
    // Implement delete logic here
    console.log('Delete row with ID ' + id);

    // Remove the row visually from the HTML table
    row.remove();
}
