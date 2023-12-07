const database = require('../database.js');

//CRUD Operations for the Inventory Entries Table

//Create a new Inventory Entry

const createInventoryEntry = (part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price, part_type) => {
    const sql = `INSERT INTO InventoryEntries (part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price, part_type)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    console.log("Part_id in createInventoryEntry: ", part_id);
    console.log("Type of part_id in createInventoryEntry: ", typeof part_id);
    console.log("Location_id in createInventoryEntry: ", location_id);
    console.log("Type of location_id in createInventoryEntry: ", typeof location_id);
    console.log("Quantity in createInventoryEntry: ", quantity);
    console.log("Type of quantity in createInventoryEntry: ", typeof quantity);
    console.log("Date_last_updated in createInventoryEntry: ", date_last_updated);
    console.log("Type of date_last_updated in createInventoryEntry: ", typeof date_last_updated);
    console.log("Vendor_id in createInventoryEntry: ", vendor_id);
    console.log("Type of vendor_id in createInventoryEntry: ", typeof vendor_id);
    console.log("Manufacturer in createInventoryEntry: ", manufacturer);
    console.log("Type of manufacturer in createInventoryEntry: ", typeof manufacturer);
    console.log("Condition in createInventoryEntry: ", condition);
    console.log("Type of condition in createInventoryEntry: ", typeof condition);
    console.log("Unit_cost in createInventoryEntry: ", unit_cost);
    console.log("Type of unit_cost in createInventoryEntry: ", typeof unit_cost);
    console.log("Entry_notes in createInventoryEntry: ", entry_notes);
    console.log("Type of entry_notes in createInventoryEntry: ", typeof entry_notes);
    console.log("Sell_price in createInventoryEntry: ", sell_price);
    console.log("Type of sell_price in createInventoryEntry: ", typeof sell_price);
    console.log("Part_type in createInventoryEntry: ", part_type);
    console.log("Type of part_type in createInventoryEntry: ", typeof part_type);
    return new Promise((resolve, reject) => {
        database.run(sql, [part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price, part_type], (err) => {
            if (err) {
                console.error(`Error creating Inventory Entry for part: ${part_id}`, err);
                reject(new Error(`Error creating Inventory Enrty. Please try again later`));

            } else {
                resolve(this.lastID);
            }
        });
    });
}


const getSpecificInventoryEntry = (formData) => {
    let sql = `
        SELECT 
            InventoryEntries.part_id,
            InventoryEntries.vendor_id,
            InventoryEntries.location_id,
            InventoryEntries.inventory_entry_id,
            Parts.part_prefix,
            Parts.part_number,
            InventoryEntries.part_type,
            InventoryEntries.quantity,
            InventoryEntries.condition,
            InventoryEntries.manufacturer,
            InventoryEntries.unit_cost,
            InventoryEntries.entry_notes,
            Vendors.vendor_name,
            Warehouse.warehouse_name,
            Zones.zone_name
        FROM
            InventoryEntries
        INNER JOIN
            Parts ON InventoryEntries.part_id = Parts.part_id
        LEFT JOIN
            Locations ON InventoryEntries.location_id = Locations.location_id
        LEFT JOIN
            Zones ON Locations.zone_id = Zones.zone_id
        LEFT JOIN
            Warehouse ON Locations.warehouse_id = Warehouse.warehouse_id
        LEFT JOIN
            Vendors ON InventoryEntries.vendor_id = Vendors.vendor_id
        WHERE
            1=1`;

    let sqlParams = [];
    console.log("formData in getSpecificInventoryEntry: ", formData);

    if (formData.prefix) {
        sql += ` AND (Parts.part_prefix = ? OR ? IS NULL)`;
        sqlParams.push(formData.prefix);
    }

    if (formData.partNumber !== undefined) {
        sql += ` AND Parts.part_number = ?`;
        sqlParams.push(formData.partNumber);
    }

    if (formData.type) {
        sql += `  AND (InventoryEntries.part_type = ? OR ? IS NULL)`;
        sqlParams.push(formData.type);
    }

    if (formData.quantity) {
        console.log("Quantity is defined in getSpecificInventoryEntry");
        sql += `  AND (InventoryEntries.quantity = ? OR ? IS NULL)`;
        sqlParams.push(formData.quantity);
    }

    if (formData.warehouse_name !== undefined) {
        sql += ` AND (Warehouse.warehouse_name = ? OR ? IS NULL)`;
        sqlParams.push(formData.warehouse_name);
    }

    if (formData.zone_name !== undefined) {
        sql += `  AND (Zones.zone_name = ? OR ? IS NULL)`;
        sqlParams.push(formData.zone_name);
    }

    if (formData.vendor_name !== undefined) {
        sql += ` AND (Vendors.vendor_name = ? OR ? IS NULL)`;
        sqlParams.push(formData.vendor_name);
    }

    if (formData.manufacturer !== undefined) {
        sql += ` AND (InventoryEntries.manufacturer = ? OR ? IS NULL)`;
        sqlParams.push(formData.manufacturer);
    }

    if (formData.condition !== undefined) {
        sql += ` AND (InventoryEntries.condition = ? OR ? IS NULL)`;
        sqlParams.push(formData.condition);
    }

    if (formData.unit_cost !== undefined) {
        sql += `  AND (InventoryEntries.unit_cost = ? OR ? IS NULL)`;
        sqlParams.push(formData.unit_cost);
    }

    console.log("sql in getSpecificInventoryEntry: ", sql);
    console.log("sqlParams in getSpecificInventoryEntry: ", sqlParams);

    return new Promise((resolve, reject) => {
        database.all(sql, sqlParams, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new Error(`Error retrieving Inventory Entry. Please try again later.`));
            } else {
                console.log("Returned rows in getSpecificInventoryEntry: ", rows);
                resolve(rows);
            }
        });
    });
};




const getInventoryEntry = (part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_note, sell_price, part_type) => {
    let sql = `SELECT * FROM InventoryEntries WHERE 1=1`;
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
    if (part_type != undefined) {
        sql += `AND part_type = ?`;
        sqlParams.push(part_type);
    }

    return new Promise((resolve, reject) => {
        database.all(sql, sqlParams, (err, rows) => {
            if (err) {
                reject(new Error(`Error retrieving Inventory Entry. Please try again later.`));
            } else {
                if (rows == undefined) {
                    resolve(rows);
                    return;
                }
                resolve(rows);
            }
        });
    });
}


const updateInventoryEntry = async (inventory_entry_id, updateFields) => {
    const fields = [];
    const values = [];

    // Construct SQL query dynamically based on provided fields
    Object.entries(updateFields).forEach(([key, value]) => {
        fields.push(`${key} = ?`);
        values.push(value);
    });

    const sql = `UPDATE InventoryEntries SET ${fields.join(', ')} WHERE inventory_entry_id = ?`;
    console.log("Query in updateInventoryEntry in entries CRUD: ", sql);
    values.push(inventory_entry_id);
    console.log("Values in updateInventoryEntry in entries CRUD: ", values);

    return new Promise((resolve, reject) => {
        database.run(sql, values, function(err) {
            if (err) {
                console.error('Error in updateInventoryEntry:', err.message);
                reject(new Error(`Error updating Inventory Entry. Please try again later.`));
            } else {
                console.log(`Row(s) updated: ${this.changes}`);
                resolve(this.changes); // Resolves with the number of rows updated
            }
        });
    });
};



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

const softDeleteInventoryEntry = async(inventory_entry_id, delete_reason) => {
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
                   (inventory_entry_id, part_id, location_id, quantity, date_last_updated, 
                   vendor_id, manufacturer, condition, unit_cost, entry_notes, 
                   sell_price, part_type, deleted_date, delete_reason)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const valuesForInsert = [...Object.values(rows), new Date().toISOString(), delete_reason];

            database.run(sqlInsert, valuesForInsert, (err) => {
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

const getDeletedInventoryEntries = () => {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM DeletedInventoryEntries`, (err, rows) => {
            if(err){
                return reject(err);
            }
            resolve(rows);
        });
    });
}


const updateInventoryEntryPartType = (inventory_entry_id, part_type) => {
    const sql = `UPDATE InventoryEntries SET part_type = ? WHERE inventory_entry_id = ?`;
    return new Promise((resolve, reject) => {
        database.run(sql, [part_type, inventory_entry_id], (err) => {
            if (err) {
                reject(new Error(`Error updating Inventory Entry part type. Please try again later.`));
            } else {
                resolve(null);
            }
        });
    }
    );
}



const recoverDeletedPart = (inventory_entry_id) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT * FROM DeletedInventoryEntries WHERE inventory_entry_id = ?`, [inventory_entry_id], (err, rows) => {
            if(err) {
                return reject(err);
            }
            if(!rows) {
                return reject(new Error(`Error recovering Inventory Entry. Inventory Entry not found.`));
            }

            // Prepare the values for insertion, excluding inventory_entry_id, deleted_date, and delete_reason
            const {
                inventory_entry_id, deleted_date, delete_reason, ...insertValues
            } = rows;

            // Insert the deleted row back into the InventoryEntries table
            const sqlInsert = `INSERT INTO InventoryEntries 
                               (part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, 
                               condition, unit_cost, entry_notes, sell_price, part_type)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            database.run(sqlInsert, Object.values(insertValues), (err) => {
                if(err) {
                    return reject(err);
                }

                // Delete the row from the DeletedInventoryEntries table
                const sqlDelete = `DELETE FROM DeletedInventoryEntries WHERE inventory_entry_id = ?`;
                database.run(sqlDelete, [inventory_entry_id], (err) => {
                    if(err) {
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
    recoverDeletedPart,
    getSpecificInventoryEntry,
    getDeletedInventoryEntries,
}





