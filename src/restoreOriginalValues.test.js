// restoreOriginalValues.test.js

const { restoreOriginalValues } = require('./restoreOriginalValues');

let currentData;
let currentlyEditingRow;

beforeEach(() => {
    currentData = [
        { cell1: "Original 1", cell2: "Original 2" },
    ];
    currentlyEditingRow = null;
});

function createMockRow(cells) {
    const row = document.createElement('tr');
    cells.forEach(cellData => {
        const cell = document.createElement('td');
        cell.textContent = cellData;
        row.appendChild(cell);
    });
    row.appendChild(document.createElement('td')); // Mock action button cell
    return row;
}

describe('restoreOriginalValues', () => {
    it('should restore original values of a row', () => {
        const mockRow = createMockRow(["Edited 1", "Edited 2", ""]);
        document.body.appendChild(mockRow); // Append to mock DOM
        currentlyEditingRow = mockRow;

        restoreOriginalValues(mockRow, currentData);

        console.log('Cell 0 text after restore:', mockRow.cells[0].textContent);

        expect(mockRow.cells[0].textContent).toBe("Original 1");
    });

    it('should do nothing if original data is not found', () => {
        const mockRow = createMockRow(["Edited 1", "Edited 2", ""]);
        document.body.appendChild(mockRow);
        currentlyEditingRow = mockRow;

        restoreOriginalValues(mockRow, []);

        console.log('Cell 0 text after no-op:', mockRow.cells[0].textContent);

        expect(mockRow.cells[0].textContent).toBe("Edited 1");
    });
});
