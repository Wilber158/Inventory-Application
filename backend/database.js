const sqlite3 = require('sqlite3').verbose();
const path = require('path');




const dbPath = path.join(__dirname, 'inventory.db');

// Open a database connection. If the file does not exist, it will be created.
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        setupDatabase();
    }
});

// Function to setup the database
function setupDatabase() {
    // Define SQL queries to create your tables if they don't exist
    const createPartsTable = `
        CREATE TABLE IF NOT EXISTS Parts (
            part_id INTEGER PRIMARY KEY AUTOINCREMENT,
            part_number TEXT NOT NULL,
            description TEXT,
            creation_date TEXT,
            priority_flag BOOLEAN,
            part_notes TEXT,
            part_abbreviation TEXT,
            part_prefix TEXT,
            quantity_sold INTEGER DEFAULT 0
        )
    `;
    
    // Execute the query to create the Parts table
    db.run(createPartsTable, (err) => {
        if (err) {
            console.error('Error creating Parts table', err.message);
        } else {
            console.log('Parts table created or already exists.');
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
            location_notes TEXT, 
            zone_id INTEGER,
            warehouse_id INTEGER,
            single_part_only BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (zone_id) REFERENCES Zones(zone_id),
            FOREIGN KEY (warehouse_id) REFERENCES Warehouse(warehouse_id)
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
            part_id INTEGER NOT NULL,
            location_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            date_last_updated DATE NOT NULL,
            vendor_id INTEGER,
            manufacturer TEXT,
            condition TEXT NOT NULL,
            unit_cost REAL,
            entry_notes TEXT,
            sell_price REAL,
            part_type TEXT,
            FOREIGN KEY (part_id) REFERENCES Parts(part_id),
            FOREIGN KEY (location_id) REFERENCES Locations(location_id),
            FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id)
        );
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
            customer_id INTEGER,
            part_id INTEGER,
            unit_price REAL,
            last_updated DATE,
            sell_point_notes TEXT,
            FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
            FOREIGN KEY (part_id) REFERENCES Parts(part_id)
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
            part_id INTEGER,
            addition_quantity INTEGER,
            addition_date DATE,
            vendor_id INTEGER,
            addition_notes TEXT,
            FOREIGN KEY (part_id) REFERENCES Parts(part_id),
            FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id)
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
            description TEXT,
            creation_date TEXT,
            priority_flag BOOLEAN,
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
            part_id INTEGER,
            location_id INTEGER,
            quantity INTEGER NOT NULL,
            date_last_updated DATE NOT NULL,
            vendor_id INTEGER,
            manufacturer TEXT,
            condition TEXT,
            unit_cost REAL,
            entry_notes TEXT,
            sell_price REAL,
            part_type TEXT,
            deleted_date DATE,
            delete_reason INTEGER,
            FOREIGN KEY (part_id) REFERENCES Parts(part_id),
            FOREIGN KEY (location_id) REFERENCES Locations(location_id),
            FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id)
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
module.exports = db;
