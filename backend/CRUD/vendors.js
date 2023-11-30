const database = require('../database.js');


//CRUD functions for vendors

//Create

const createVendor = (vendor_name, vendor_notes) => {
    return new Promise((resolve, reject) => {
        database.run(`INSERT INTO Vendors (vendor_name, vendor_notes) VALUES (?, ?)`, [vendor_name, vendor_notes], function (err) {
            if (err) {
                console.error('Error creating vendor', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const getVendor_id = (vendor_name) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT vendor_id FROM Vendors WHERE vendor_name = ?`, [vendor_name], function (err, row) {
            if (err) {
                console.error('Error getting vendor id', err.message);
                reject(err);
            } else {
                resolve(row.vendor_id);
            }
        });
    });
}

const getVendor_name = (vendor_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT vendor_name FROM Vendors WHERE vendor_id = ?`, [vendor_id], function (err, row) {
            if (err) {
                console.error('Error getting vendor name', err.message);
                reject(err);
            } else {
                resolve(row.vendor_name);
            }
        });
    });
}

const getVendor_notes = (vendor_name) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT vendor_notes FROM Vendors WHERE vendor_name = ?`, [vendor_name], function (err, row) {
            if (err) {
                console.error('Error getting vendor notes', err.message);
                reject(err);
            } else {
                resolve(row.vendor_notes);
            }
        });
    });
}

const getAllVendors = () => {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM Vendors`, function (err, rows) {
            if (err) {
                console.error('Error getting all vendors', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const updateVendorName = (vendor_id, vendor_name_new) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE Vendors SET vendor_name = ? WHERE vendor_id = ?`, [vendor_name_new, vendor_id], function (err) {
            if (err) {
                console.error('Error updating vendor name', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

const updateVendorNotes = (vendor_id, vendor_notes) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE Vendors SET vendor_notes = ? WHERE vendor_id = ?`, [vendor_notes, vendor_id], function (err) {
            if (err) {
                console.error('Error updating vendor notes', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

const deleteVendor = (vendor_id) => {
    return new Promise((resolve, reject) => {
        database.run(`DELETE FROM Vendors WHERE vendor_id = ?`, [vendor_id], function (err) {
            if (err) {
                console.error('Error deleting vendor', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = {
    createVendor,
    getVendor_id,
    getVendor_name,
    getVendor_notes,
    getAllVendors,
    updateVendorName,
    updateVendorNotes,
    deleteVendor
}
