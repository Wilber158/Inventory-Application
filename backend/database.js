// db/database.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to where your database file will be located. 
// You can place it in the same directory or a dedicated data directory.
const dbPath = path.join(__dirname, 'inventory.db');

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
            part_notes TEXT
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
    
    const createLocationsTable = `
        CREATE TABLE IF NOT EXISTS Locations (
            location_id INTEGER PRIMARY KEY AUTOINCREMENT,
            zone_id INTEGER FOREIGN KEY REFERENCES Zones(zone_id),
            location_name TEXT UNIQUE NOT NULL,
            location_notes TEXT
            single_part_only BOOLEAN
        )
    `;

    db.run(createLocationsTable, (err) => {
        if (err) {
            console.error('Error creating Locations table', err.message);
        } else {
            console.log('Locations table created or already exists.');
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
        

    // Repeat for other tables...
}

// You might want to export the database connection to use it in other modules
module.exports = db;
