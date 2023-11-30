const fs = require('fs');
const csv = require('csv-parser');
const database = require('database.js');
const inventoryCRUD = require('CRUD/inventory_entries.js');


//CSV parsing functions
//CSV FORMAT 
//Part Prefix | Part Number | Part Type	| Warehouse	| Zone | Quantity | Condition | Unit Cost| Entry Notes| Vendor Name | Manufacturer | Date
