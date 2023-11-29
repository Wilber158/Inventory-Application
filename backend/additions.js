const database = require('./database.js');

//CRUD functions for additions


//Create

const createAddition = (part_id, quantity_added, date_last_added, vendor_id) => {
    return new Promise((resolve, reject) => {
        database.run(`INSERT INTO Additions (part_id, quantity_added, date_last_added, vendor_id) VALUES (?, ?, ?, ?)`, [part_id, quantity_added, date_last_added, vendor_id], function (err) {
            if (err) {
                console.error('Error creating addition', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

const getAllPartAdditions = (part_id) => {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM Additions WHERE part_id = ?`, [part_id], function (err, rows) {
            if (err) {
                console.error('Error getting all additions', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const getTotalQuantityAdded = (part_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT SUM(quantity_added) FROM Additions WHERE part_id = ?`, [part_id], function (err, row) {
            if (err) {
                console.error('Error getting total quantity added', err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const oldestAddition = (part_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT MIN(date_last_added) FROM Additions WHERE part_id = ?`, [part_id], function (err, row) {
            if (err) {
                console.error('Error getting oldest addition', err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const newestAddition = (part_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT MAX(date_last_added) FROM Additions WHERE part_id = ?`, [part_id], function (err, row) {
            if (err) {
                console.error('Error getting newest addition', err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const deleteAddition = (addition_id) => {
    return new Promise((resolve, reject) => {
        database.run(`DELETE FROM Additions WHERE addition_id = ?`, [addition_id], function (err) {
            if (err) {
                console.error('Error deleting addition', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}


module.exports = {
    createAddition,
    getAllPartAdditions,
    getTotalQuantityAdded,
    oldestAddition,
    newestAddition,
    deleteAddition
}
