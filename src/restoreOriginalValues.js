// restoreOriginalValues.js

function restoreOriginalValues(row, currentData) {
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    const originalData = currentData[rowIndex];
    if (!originalData) {
        return; // If no original data found, do nothing
    }

    // Replace input fields with the original data
    const keys = Object.keys(originalData);
    for (let i = 0; i < keys.length - 1; i++) { // Assuming the last key is for the action buttons
        row.cells[i].textContent = originalData[keys[i]];
    }

    global.currentlyEditingRow = null; // Clear the editing state
}

module.exports = { restoreOriginalValues };

