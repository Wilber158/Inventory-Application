const database = require('../database.js');

//CRUD functions for warehouses


//Create
const createWarehouse = (warehouse_name, warehouse_notes) => {
    return new Promise((resolve, reject) => {
        database.run(`INSERT INTO Warehouse (warehouse_name, warehouse_notes) VALUES (?, ?)`, [warehouse_name, warehouse_notes], function (err) {
            if (err) {
                console.error('Error creating warehouse', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const getWarehouse_id = (warehouse_name) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT warehouse_id FROM Warehouse WHERE warehouse_name = ?`, [warehouse_name], function (err, row) {
            if (err) {
                console.error('Error getting warehouse id', err.message);
                reject(err);
            } else {
                if(row == undefined){
                    resolve(row);
                    return;
                }
                resolve(row.warehouse_id);
            }
        });
    });
}

const getWarehouseById = async(warehouse_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT * FROM Warehouse WHERE warehouse_id = ?`, [warehouse_id], function (err, row) {
            if (err) {
                console.error('Error getting warehouse by id', err.message);
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


const getWarehouse_name = (warehouse_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT warehouse_name FROM Warehouse WHERE warehouse_id = ?`, [warehouse_id], function (err, row) {
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

const getWarehouse_notes = (warehouse_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT warehouse_notes FROM Warehouse WHERE warehouse_name = ?`, [warehouse_name], function (err, row) {
            if (err) {
                console.error('Error getting warehouse notes', err.message);
                reject(err);
            } else {
                if(row == undefined){
                     resolve(row);
                     return;
                }
                resolve(row.warehouse_notes);
            }
        });
    });
}

const getAllWarehouses = () => {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM Warehouse`, function (err, rows) {
            if (err) {
                console.error('Error getting all warehouses', err.message);
                reject(err);
            } else {
                if(row == undefined){
                    resolve(row);
                }
                resolve(rows);
            }
        });
    });
}

const updateWarehouse_name = (warehouse_id, warehouse_name) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE Warehouse SET warehouse_name = ? WHERE warehouse_id = ?`, [warehouse_name, warehouse_id], function (err) {
            if (err) {
                console.error('Error updating warehouse name', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}


const updateWarehouse_notes = (warehouse_id, warehouse_notes) => {
    return new Promise((resolve, reject) => {
        database.run(`UPDATE Warehouse SET warehouse_notes = ? WHERE warehouse_id = ?`, [warehouse_notes, warehouse_id], function (err) {
            if (err) {
                console.error('Error updating warehouse notes', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

//Delete
const deleteWarehouse = (warehouse_id) => {
    return new Promise((resolve, reject) => {
        database.run(`DELETE FROM Warehouse WHERE warehouse_id = ?`, [warehouse_id], function (err) {
            if (err) {
                console.error('Error deleting warehouse', err.message);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = {
    createWarehouse,
    getWarehouse_id,
    getWarehouse_name,
    getWarehouse_notes,
    getAllWarehouses,
    updateWarehouse_name,
    updateWarehouse_notes,
    deleteWarehouse,
    getWarehouseById
}




