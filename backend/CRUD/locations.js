const { LIMIT_SQL_LENGTH } = require('sqlite3');
const database = require('../database.js');



//CRUD functions for locations

//Create

const createLocation = (locations_notes, zone_name, warehouse_name, single_part_only=false) => {
    const sql = `INSERT INTO Locations (location_notes, zone_name, warehouse_name, single_part_only) VALUES (?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
        database.run(sql, [locations_notes, zone_name, warehouse_name, single_part_only], function (err) {
            if (err) {
                console.log("Location_notes: ", locations_notes);
                console.log("Type of location_notes: ", typeof locations_notes);
                console.error('Error creating location', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const getLocation_id = (zone_name, warehouse_name) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT location_id FROM Locations WHERE zone_name = ? AND warehouse_name = ?`, [zone_name, warehouse_name], function (err, row) {
            if (err) {
                console.error('Error getting location id', err.message);
                reject(err);
            } else {
                if(row == undefined){
                    resolve(row);
                    return;
                }
                resolve(row);
            }
        });
    });
}

const getLocation_notes = (location_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT location_notes FROM Locations WHERE location_id = ?`, [location_id], function (err, row) {
            if (err) {
                console.error('Error getting location notes', err.message);
                reject(err);
            } else {
                if(row == undefined){
                    resolve(row);
                    return;
                }
                resolve(row.location_notes);
            }
        });
    });
}

const getZone_name = (location_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT zone_name FROM Locations WHERE location_id = ?`, [location_id], function (err, row) {
            if (err) {
                console.error('Error getting zone name', err.message);
                reject(err);
            } else {
                if(row == undefined){
                    resolve(row);
                    return;
                }
                resolve(row.zone_name);
            }
        });
    });
}

const getWarehouse_name = (location_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT warehouse_name FROM Locations WHERE location_id = ?`, [location_id], function (err, row) {
            if (err) {
                console.error('Error getting warehouse name', err.message);
                reject(err);
            } else {
                if(row == undefined){
                    resolve(row);
                    return;
                }
                resolve(row.warehouse_name);
            }
        });
    });
}

const getSingle_part_only = (location_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT single_part_only FROM Locations WHERE location_id = ?`, [location_id], function (err, row) {
            if (err) {
                console.error('Error getting single part only', err.message);
                reject(err);
            } else {
                if(row == undefined){
                    resolve(row);
                    return;
                }
                resolve(row.single_part_only);
            }
        });
    });
}

const getAllLocations = () => {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM Locations`, function (err, rows) {
            if (err) {
                console.error('Error getting all locations', err.message);
                reject(err);
            } else {
                if(rows == undefined){
                    resolve(rows);
                }
                resolve(rows);
            }
        });
    });
}

const updateLocation_notes = (location_id, location_notes) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE Locations SET location_notes = ? WHERE location_id = ?`, [location_notes, location_id], function (err) {
            if (err) {
                console.error('Error updating location notes', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const updateLocation_zone_name = (location_id, zone_name) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE Locations SET zone_name = ? WHERE location_id = ?`, [zone_name, location_id], function (err) {
            if (err) {
                console.error('Error updating zone name', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const updateLocation_warehouse_name = (location_id, warehouse_name) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE Locations SET warehouse_name = ? WHERE location_id = ?`, [warehouse_name, location_id], function (err) {
            if (err) {
                console.error('Error updating warehouse name', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const updateLocation_single_part_only = (location_id, single_part_only) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE Locations SET single_part_only = ? WHERE location_id = ?`, [single_part_only, location_id], function (err) {
            if (err) {
                console.error('Error updating single part only', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}


//Delete
const deleteLocation = (location_id) => {
    return new Promise((resolve, reject) => {
        database.run(`DELETE FROM Locations WHERE location_id = ?`, [location_id], function (err) {
            if (err) {
                console.error('Error deleting location', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const deleteAllLocations = () => {
    return new Promise((resolve, reject) => {
        database.run(`DELETE FROM Locations`, function (err) {
            if (err) {
                console.error('Error deleting all locations', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

module.exports = {
    createLocation,
    getLocation_id,
    getLocation_notes,
    getZone_name,
    getWarehouse_name,
    getSingle_part_only,
    getAllLocations,
    updateLocation_notes,
    updateLocation_zone_name,
    updateLocation_warehouse_name,
    updateLocation_single_part_only,
    deleteLocation,
    deleteAllLocations
}

// Path: backend/locations.js



