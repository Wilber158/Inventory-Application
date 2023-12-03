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

let currentData = [];


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


            //validate the form data
            //TODO

            // Send the form data to the main process
            await window.electronAPI.get_Inventory_Entries(formData);

            // Listen for the response from the main process
            window.electronAPI.get_Inventory_Entries_Response((result) => {
                if(result.error){
                    console.log(result.error);
                    return;
                }
                else{
                    currentData = result;
                  renderTable(result);
                }
            });
        } else{
            console.log("Form is not valid")
            form.reportValidity()
        }
    });
});

function renderTable(data) {
    const table = document.getElementById('dataTable');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    data.forEach(item => {
        const row = table.insertRow();
        Object.values(item).forEach(text => {
            const cell = row.insertCell();
            cell.textContent = text;
        });

        const editBtn = document.createElement('span');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        const btnCell = row.insertCell();
        btnCell.appendChild(editBtn);
        btnCell.appendChild(deleteBtn);
    });
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
