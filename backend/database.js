const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to where your database file will be located. 
// You can place it in the same directory or a dedicated data directory.
const dbPath = path.join(__dirname, 'database/inventory.db');

// Open a database connection. If the file does not exist, it will be created.
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        // Call your function to setup the database (e.g., create tables)
        setupDatabase();
    }
});

// Function to setup the database (e.g., create tables)
function setupDatabase() {
    // Define SQL queries to create your tables if they don't exist
    const createPartsTable = `
        CREATE TABLE IF NOT EXISTS Parts (
            part_id INTEGER PRIMARY KEY AUTOINCREMENT,
            part_number TEXT UNIQUE NOT NULL,
            description TEXT,
            creation_date TEXT,
            priority_flag BOOLEAN,
            part_notes TEXT,
            part_abbreviation TEXT,
            part_prefix TEXT,
            quantity_sold INTEGER
        )
    `;
    
    // Execute the query to create the Parts table
    db.run(createPartsTable, (err) => {
        if (err) {
            console.error('Error creating Parts table', err.message);
        } else {
            console.log('Parts table created or already exists.');
            // You can place more table creation code here or seed initial data
        }
    });

    const createZonesTable = `
        CREATE TABLE IF NOT EXISTS Zones (
            zone_id INTEGER PRIMARY KEY AUTOINCREMENT,
            zone_name TEXT UNIQUE NOT NULL,
            zone_notes TEXT
        )
    `;

    db.run(createZonesTable, (err) => {
        if (err) {
            console.error('Error creating Zones table', err.message);
        } else {
            console.log('Zones table created or already exists.');
        }
    });

    const createWarehouseTable = `
        CREATE TABLE IF NOT EXISTS Warehouse (
            warehouse_id INTEGER PRIMARY KEY AUTOINCREMENT,
            warehouse_name TEXT UNIQUE NOT NULL,
            warehouse_notes TEXT
        )`;

    db.run(createWarehouseTable, (err) => {
        if (err) {
            console.error('Error creating Warehouse table', err.message);
        } else {
            console.log('Warehouse table created or already exists.');
        }
    }
    );
    
    const createLocationsTable = `
        CREATE TABLE IF NOT EXISTS Locations (
            location_id INTEGER PRIMARY KEY AUTOINCREMENT,
            location_notes TEXT UNIQUE, 
            zone_name TEXT FOREIGN KEY REFERENCES Zones(zone_name),
            warehouse_name TEXT FOREIGN KEY REFERENCES Warehouse(warehouse_name),
            single_part_only BOOLEAN NOT NULL
        )
    `;

    db.run(createLocationsTable, (err) => {
        if (err) {
            console.error('Error creating Locations table', err.message);
        } else {
            console.log('Locations table created or already exists.');
        }
    });

    const createVendorTable = `
        CREATE TABLE IF NOT EXISTS Vendors (
            vendor_id INTEGER PRIMARY KEY AUTOINCREMENT,
            vendor_name TEXT UNIQUE NOT NULL,
            vendor_notes TEXT
        )
    `;

    db.run(createVendorTable, (err) => {
        if (err) {
            console.error('Error creating Vendors table', err.message);
        } else {
            console.log('Vendors table created or already exists.');
        }
    }
    );

    const createCustomerTable = `
        CREATE TABLE IF NOT EXISTS Customers (
            customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT UNIQUE NOT NULL,
            customer_notes TEXT
        )
    `;

    db.run(createCustomerTable, (err) => {
        if (err) {
            console.error('Error creating Customers table', err.message);
        } else {
            console.log('Customers table created or already exists.');
        }
    }
    );

    const createInventoryEntryTable = `
        CREATE TABLE IF NOT EXISTS InventoryEntries (
            inventory_entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
            part_number INTEGER FOREIGN KEY REFERENCES Parts(part_number),
            location_id INTEGER FOREIGN KEY REFERENCES Locations(location_id),
            quantity INTEGER NOT NULL,
            data_last_updated DATE NOT NULL,
            vendor_id INTEGER FOREIGN KEY REFERENCES Vendors(vendor_id),
            manufacturer TEXT,
            condition TEXT,
            unit_cost REAL,
            entry_notes TEXT,
            sell_price REAL
        )
    `;

    db.run(createInventoryEntryTable, (err) => {
        if (err) {
            console.error('Error creating InventoryEntries table', err.message);
        } else {
            console.log('InventoryEntries table created or already exists.');
        }
    }
    );



    const createSellPointTable = `
        CREATE TABLE IF NOT EXISTS SellPoints (
            sell_point_id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER FOREIGN KEY REFERENCES Customers(customer_id),
            part_id INTEGER FOREIGN KEY REFERENCES Parts(part_number),
            unit_price REAL,
            last_updated DATE,
            sell_point_notes TEXT
        )
    `;

    db.run(createSellPointTable, (err) => {
        if (err) {
            console.error('Error creating SellPoints table', err.message);
        } else {
            console.log('SellPoints table created or already exists.');
        }
    }
    );

    const createAdditionsTable = `
        CREATE TABLE IF NOT EXISTS Additions (
            addition_id INTEGER PRIMARY KEY AUTOINCREMENT,
            part_name INTEGER FOREIGN KEY REFERENCES Parts(part_number),
            addition_quantity INTEGER,
            addition_date DATE,
            vendor_id INTEGER FOREIGN KEY REFERENCES Vendors(vendor_id),
            addition_notes TEXT
        )
    `;

    db.run(createAdditionsTable, (err) => {
        if (err) {
            console.error('Error creating Additions table', err.message);
        } else {
            console.log('Additions table created or already exists.');
        }
    }
    );


    const createDeletedPartsTable = `
        CREATE TABLE IF NOT EXISTS DeletedParts (
            part_id INTEGER PRIMARY KEY AUTOINCREMENT,
            part_number TEXT UNIQUE NOT NULL,
            description TEXT,
            creation_date TEXT,
            priority_flag BOOLEAN,
            part_notes TEXT,
            part_abbreviation TEXT,
            part_prefix TEXT,
            deleted_date DATE,
            deleted_reason INTEGER
        )
        `;

    db.run(createDeletedPartsTable, (err) => {
        if (err) {
            console.error('Error creating DeletedParts table', err.message);
        } else {
            console.log('DeletedParts table created or already exists.');
        }
    }
    );

    const createDeletedInventoryEntriesTable = `
        CREATE TABLE IF NOT EXISTS DeletedInventoryEntries (
            inventory_entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
            part_number INTEGER FOREIGN KEY REFERENCES Parts(part_number),
            location_id INTEGER FOREIGN KEY REFERENCES Locations(location_id),
            quantity INTEGER NOT NULL,
            date_quantity_added DATE NOT NULL,
            vendor_id INTEGER FOREIGN KEY REFERENCES Vendors(vendor_id),
            manufacturer TEXT,
            condition TEXT,
            unit_cost REAL,
            inventory_entry_notes TEXT,
            sell_price REAL,
            deleted_date DATE,
            deleted_reason INTEGER
        )
        `;
    
    db.run(createDeletedInventoryEntriesTable, (err) => {
        if (err) {
            console.error('Error creating DeletedInventoryEntries table', err.message);
        } else {
            console.log('DeletedInventoryEntries table created or already exists.');
        }
    }
    );

    


    



}

// You might want to export the database connection to use it in other modules
module.exports = db;
