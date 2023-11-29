const database = require('./database.js');


//CRUD functions for selling points

//Create

const createSellingPoint = (customer_id, part_id, unit_price, last_updated, selling_point_notes) => {
    return new Promise((resolve, reject) => {
        database.run(`INSERT INTO SellingPoints (customer_id, part_id, unit_price, last_updated, selling_point_notes) VALUES (?, ?, ?, ?, ?)`,
         [customer_id, part_id, unit_price, last_updated, selling_point_notes], function (err) {
            if (err) {
                console.error('Error creating selling point', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

const getAllSellingPoints = () => {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM SellingPoints`, function (err, rows) {
            if (err) {
                console.error('Error getting all selling points', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const getSellingPoint = (sell_point_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT * FROM SellingPoints WHERE sell_point_id = ?`, [sell_point_id], function (err, row) {
            if (err) {
                console.error('Error getting selling point', err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}


const getSellingPoint_id = (customer_id, part_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT selling_point_id FROM SellingPoints WHERE customer_id = ? AND part_id = ?`, [customer_id, part_id], function (err, row) {
            if (err) {
                console.error('Error getting selling point id', err.message);
                reject(err);
            } else {
                resolve(row.selling_point_id);
            }
        });
    });
}

const updateSellingPoint_notes = (sell_point_id, selling_point_notes) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE SellingPoints SET selling_point_notes = ? WHERE sell_point_id = ?`, [selling_point_notes, sell_point_id], function (err) {
            if (err) {
                console.error('Error updating selling point notes', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

const updateSellingPoint_unit_price = (sell_point_id, unit_price) => {
    date = new Date().toISOString();
    return new Promise((resolve, reject) => {
        database.run(`UPDATE SellingPoints SET unit_price = ?, last_updated = ? WHERE sell_point_id = ?`, [unit_price, date, sell_point_id], function (err) {
            if (err) {
                console.error('Error updating selling point unit price', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

const updateSellingPoint_customer_id = (sell_point_id, customer_id) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE SellingPoints SET customer_id = ? WHERE sell_point_id = ?`, [customer_id, sell_point_id], function (err) {
            if (err) {
                console.error('Error updating selling point customer id', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}
 

const deleteSellingPoint = (sell_point_id) => {
    return new Promise((resolve, reject) => {
        database.run(`DELETE FROM SellingPoints WHERE sell_point_id = ?`, [sell_point_id], function (err) {
            if (err) {
                console.error('Error deleting selling point', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = {
    createSellingPoint,
    getAllSellingPoints,
    getSellingPoint,
    getSellingPoint_id,
    updateSellingPoint_notes,
    updateSellingPoint_unit_price,
    updateSellingPoint_customer_id,
    deleteSellingPoint
}