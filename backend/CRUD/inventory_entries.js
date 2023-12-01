const database = require('../database.js');

//CRUD Operations for the Inventory Entries Table

//Create a new Inventory Entry

const createInventoryEntry = (part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price) => {
    const sql = `INSERT INTO InventoryEntries (part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    return new Promise((resolve, reject) => {
        database.run(sql, [part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price], (err) => {
            if (err) {
                console.error(`Error creating Inventory Entry for part: ${part_id}`, err);
                reject(new Error(`Error creating Inventory Enrty. Please try again later`));

            } else {
                resolve(this.lastID);
            }
        });
    });
}

const getInventoryEntry = (part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_note, sell_price) => {
    const sql = `SELECT * FROM InventoryEntries WHERE 1=1 j`;
    let sqlParams = [];
    if (part_id != undefined) {
        sql += `AND part_id = ?`;
        sqlParams.push(part_id);
    }

    if (location_id != undefined) {
        sql += `AND location_id = ?`;
        sqlParams.push(location_id);
    }

    if (quantity != undefined) {
        sql += `AND quantity = ?`;
        sqlParams.push(quantity);
    }

    if (date_last_updated != undefined) {
        sql += `AND date_last_updated = ?`;
        sqlParams.push(date_last_updated);
    }

    if (vendor_id != undefined) {
        sql += `AND vendor_id = ?`;
        sqlParams.push(vendor_id);
    }

    if (manufacturer != undefined) {
        sql += `AND manufacturer = ?`;
        sqlParams.push(manufacturer);
    }

    if (condition != undefined) {
        sql += `AND condition = ?`;
        sqlParams.push(condition);
    }

    if (unit_cost != undefined) {
        sql += `AND unit_cost = ?`;
        sqlParams.push(unit_cost);
    }

    if (entry_note != undefined) {
        sql += `AND entry_note = ?`;
        sqlParams.push(entry_note);
    }

    if (sell_price != undefined) {
        sql += `AND sell_price = ?`;
        sqlParams.push(sell_price);
    }

    return new Promise((resolve, reject) => {
        database.get(sql, sqlParams, (err, rows) => {
            if (err) {
                reject(new Error(`Error retrieving Inventory Entry. Please try again later.`));
            } else {
                resolve(rows);
            }
        });
    });
}

const updateInventoryEntry = (inventory_entry_id, updateFields) => {
    const fields = [];
    const values = [];

    // Construct SQL query dynamically based on provided fields
    Object.entries(updateFields).forEach(([key, value]) => {
        fields.push(`${key} = ?`);
        values.push(value);
    });

    const sql = `UPDATE InventoryEntries SET ${fields.join(', ')} WHERE inventory_entry_id = ?`;
    values.push(inventory_entry_id);

    return new Promise((resolve, reject) => {
        database.run(sql, values, (err) => {
            if (err) {
                reject(new Error(`Error updating Inventory Entry. Please try again later.`));
            } else {
                resolve(null);
            }
        });
    });
}


const updateInventoryEntryQuantity = (inventory_entry_id, quantity) => {
    date_last_updated = new Date();
    const sql = `UPDATE InventoryEntries 
                 SET quantity = ?, 
                 date_last_updated = ? 
                 WHERE inventory_entry_id = ?`;
    return new Promise((resolve, reject) => {
        database.run(sql, [quantity, date_last_updated, inventory_entry_id], (err) => {
            if (err) {
                reject(new Error(`Error updating Inventory Entry quantity. Please try again later.`));
            } else {
                resolve(null);
            }
        });
    });
}

const updateInventoryEntryLocation = (inventory_entry_id, location_id) => {
    const sql = `UPDATE InventoryEntries SET location_id = ? WHERE inventory_entry_id = ?`;
    return new Promise((resolve, reject) => {
        database.run(sql, [location_id, inventory_entry_id], (err) => {
            if (err) {
                reject(new Error(`Error updating Inventory Entry location. Please try again later.`));
            } else {
                resolve(null);
            }
        });
    });
}

const updateInventoryEntryCondition = (inventory_entry_id, condition) => {
    const sql = `UPDATE InventoryEntries SET condition = ? WHERE inventory_entry_id = ?`;
    return new Promise((resolve, reject) => {
        database.run(sql, [condition, inventory_entry_id], (err) => {
            if (err) {
                reject(new Error(`Error updating Inventory Entry condition. Please try again later.`));
            } else {
                resolve(null);
            }
        });
    });
}

const updateInventoryEntryVendor = (inventory_entry_id, vendor_id) => {
    const sql = `UPDATE InventoryEntries SET vendor_id = ? WHERE inventory_entry_id = ?`;
    return new Promise((resolve, reject) => {
        database.run(sql, [vendor_id, inventory_entry_id], (err) => {
            if (err) {
                reject(new Error(`Error updating Inventory Entry vendor. Please try again later.`));
            } else {
                resolve(null);
            }
        });
    });
}

const updateInventoryEntryManufacturer = (inventory_entry_id, manufacturer) => {
    const sql = `UPDATE InventoryEntries SET manufacturer = ? WHERE inventory_entry_id = ?`;
    return new Promise((resolve, reject) => {
        database.run(sql, [manufacturer, inventory_entry_id], (err) => {
            if (err) {
                reject(new Error(`Error updating Inventory Entry manufacturer. Please try again later.`));
            } else {
                resolve(null);
            }
        });
    });
}

const updateInventoryEntryUnitCost = (inventory_entry_id, unit_cost) => {
    const sql = `UPDATE InventoryEntries SET unit_cost = ? WHERE inventory_entry_id = ?`;
    return new Promise((resolve, reject) => {
        database.run(sql, [unit_cost, inventory_entry_id], (err) => {
            if (err) {
                reject(new Error(`Error updating Inventory Entry unit cost. Please try again later.`));
            } else {
                resolve(null);
            }
        });
    });
}

const updateInventoryEntryNotes = (inventory_entry_id, entry_notes) => {
    const sql = `UPDATE InventoryEntries SET entry_notes = ? WHERE inventory_entry_id = ?`;
    return new Promise((resolve, reject) => {
        database.run(sql, [entry_notes, inventory_entry_id], (err) => {
            if (err) {
                reject(new Error(`Error updating Inventory Entry notes. Please try again later.`));
            } else {
                resolve(null);
            }
        });
    });
}

const updateInventoryEntrySellPrice = (inventory_entry_id, sell_price) => {
    const sql = `UPDATE InventoryEntries SET sell_price = ? WHERE inventory_entry_id = ?`;
    return new Promise((resolve, reject) => {
        database.run(sql, [sell_price, inventory_entry_id], (err) => {
            if (err) {
                reject(new Error(`Error updating Inventory Entry sell price. Please try again later.`));
            } else {
                resolve(null);
            }
        });
    });
}

const softDeleteInventoryEntry = (inventory_entry_id, delete_reason) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT * FROM InventoryEntries WHERE inventory_entry_id = ?`, [inventory_entry_id], (err, rows) => {
            if(err){
                return reject(err);
            }
            if(!rows){
                return reject(new Error(`Error deleting Inventory Entry. Inventory Entry not found.`));
            }

            //Insert the deleted row into the DeletedInventoryEntries table
            const sqlInsert = `INSERT INTO DeletedInventoryEntries 
                               (inventory_entry_id, part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price, deleted date, delete_reason)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            database.run(sqlInsert, [...Object.values(rows), new Date().toISOString, delete_reason], (err) => {
                if(err){
                    return reject(err);
                }
                //Delete the row from the InventoryEntries table
                const sqlDelete = `DELETE FROM InventoryEntries WHERE inventory_entry_id = ?`;
                database.run(sqlDelete, [inventory_entry_id], (err) => {
                    if(err){
                        return reject(err);
                    }
                    resolve(null);
                });
            });
        });
    });
}


const recoverDeletedPart = (inventory_entry_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT * FROM DeletedInventoryEntries WHERE inventory_entry_id = ?`, [inventory_entry_id], (err, rows) => {
            if(err){
                return reject(err);
            }
            if(!rows){
                return reject(new Error(`Error recovering Inventory Entry. Inventory Entry not found.`));
            }

            //Insert the deleted row into the InventoryEntries table
            const sqlInsert = `INSERT INTO InventoryEntries 
                               (inventory_entry_id, part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            database.run(sqlInsert, [...Object.values(rows)], (err) => {
                if(err){
                    return reject(err);
                }
                //Delete the row from the InventoryEntries table
                const sqlDelete = `DELETE FROM DeletedInventoryEntries WHERE inventory_entry_id = ?`;
                database.run(sqlDelete, [inventory_entry_id], (err) => {
                    if(err){
                        return reject(err);
                    }
                    resolve(null);
                });
            });
        });
    });
}


module.exports = {
    createInventoryEntry,
    getInventoryEntry,
    updateInventoryEntryQuantity,
    updateInventoryEntryLocation,
    updateInventoryEntryCondition,
    updateInventoryEntryVendor,
    updateInventoryEntryManufacturer,
    updateInventoryEntryUnitCost,
    updateInventoryEntryNotes,
    updateInventoryEntrySellPrice,
    updateInventoryEntry,
    softDeleteInventoryEntry,
    recoverDeletedPart
}





