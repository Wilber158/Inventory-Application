const fs = require('fs');
const csv = require('csv-parser');
const database = require('database.js');
const inventoryCRUD = require('CRUD/inventory_entries.js');


//CSV parsing functions
//CSV FORMAT 
//Part Prefix | Part Number | Part Type	| Warehouse	| Zone | Quantity | Condition | Unit Cost| Entry Notes| Vendor Name | Manufacturer | Date

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', reject);
    });
}


module.exports = {
    parseCSV
};


