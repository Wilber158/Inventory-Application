const database = require('../database.js');

//CRUD functions for zones


//Create

const createZone = (zone_name, zone_notes) => {
    return new Promise((resolve, reject) => {
        database.run(`INSERT INTO Zones (zone_name, zone_notes) VALUES (?, ?)`, [zone_name, zone_notes], function (err) {
            if (err) {
                console.error('Error creating zone', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const getAllZones = () => {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM Zones`, [], (err, rows) => {
            if (err) {
                console.error('Error getting all zones', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const getZone = (zone_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT * FROM Zones WHERE zone_id = ?`, [zone_id], function (err, row) {
            if (err) {
                console.error('Error getting zone', err.message);
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


const getZone_id = (zone_name) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT zone_id FROM Zones WHERE zone_name = ?`, [zone_name], function (err, row) {
            if (err) {
                console.error('Error getting zone id', err.message);
                reject(err);
            } else {
                if(row == undefined){
                    resolve(row);
                    return;
                }
                resolve(row.zone_id);
            }
        });
    });
}

const getZone_name = (zone_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT zone_name FROM Zones WHERE zone_id = ?`, [zone_id], function (err, row) {
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

const updateZoneNotes = (zone_id, zone_notes) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE Zones SET zone_notes = ? WHERE zone_id = ?`, [zone_notes, zone_id], function (err) {
            if (err) {
                console.error('Error updating zone notes', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const updateZoneName = (zone_id, zone_name) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE Zones SET zone_name = ? WHERE zone_id = ?`, [zone_name, zone_id], function (err) {
            if (err) {
                console.error('Error updating zone name', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const deleteZone = (zone_id) => {
    return new Promise((resolve, reject) => {
        database.run(`DELETE FROM Zones WHERE zone_id = ?`, [zone_id], function (err) {
            if (err) {
                console.error('Error deleting zone', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

module.exports = {
    createZone,
    getAllZones,
    getZone,
    getZone_id,
    getZone_name,
    updateZoneNotes,
    deleteZone,
    updateZoneName
}