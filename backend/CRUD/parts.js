const database = require('../database.js');



const getAllParts = () => {
    const sql = `
        SELECT * FROM Parts
    `;
    
    return new Promise((resolve, reject) => {
        database.all(sql, [], (err, rows) => {
            if (err) {
                console.error(`Error retrieving parts`, err);
                reject(new Error(`Error retrieving parts. Please try again later.`));
            } else {
                resolve(rows);
            }
        });
    });
}


const getPartById =  async(partId) => {
    const sql = `
        SELECT * FROM Parts
        WHERE part_id = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.get(sql, [partId], (err, row) => {
            if (err) {
                console.error(`Error retrieving part details for partId: ${partId}`, err);
                reject(new Error(`Error retrieving part details. Please try again later.`));
            } else {
                resolve(row);
            }
        });
    });
}

const getPartByNumber = (part_number) => {
    const sql = `
        SELECT * FROM Parts
        WHERE part_number = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.all(sql, [part_number], (err, row) => {
            if (err) {
                console.error(`Error retrieving part details for part_number: ${part_number}`, err);
                reject(new Error(`Error retrieving part details. Please try again later.`));
            } else {
                resolve(row);
            }
        });
    });
};

const getPartid = (part_prefix, part_number) => {
    const sql = `
        SELECT * FROM Parts
        WHERE part_prefix = ? AND part_number = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.get(sql, [part_prefix, part_number], (err, row) => {
            if (err) {
                console.error(`Error retrieving part details for part_number: ${part_number}`, err);
                reject(new Error(`Error retrieving part details. Please try again later.`));
            } else {
                console.log("Row returned in getPartid: ", row)
                if(!row){
                    resolve(row);
                    console.log("getPartid: row is null")
                    return;
                }
                console.log("getPartid:", row.part_id)
                resolve(row.part_id);
            }
        });
    });
}


const getAllPriorityParts = () => {
    const sql = `
        SELECT * FROM Parts
        WHERE priority_flag = TRUE
    `;
    
    return new Promise((resolve, reject) => {
        database.all(sql, [], (err, rows) => {
            if (err) {
                console.error(`Error retrieving priority parts`, err);
                reject(new Error(`Error retrieving priority parts. Please try again later.`));
            } else {
                console.log("getAllPriorityParts:", rows)
                resolve(rows);
            }
        });
    });
}

const getAllNonPriorityParts = () => {
    const sql = `
        SELECT * FROM Parts
        WHERE priority_flag = FALSE
    `;
    
    return new Promise((resolve, reject) => {
        database.all(sql, [], (err, rows) => {
            if (err) {
                console.error(`Error retrieving non-priority parts`, err);
                reject(new Error(`Error retrieving non-priority parts. Please try again later.`));
            } else {
                console.log("getAllNonPriorityParts:", rows)
                resolve(rows);
            }
        });
    });
}

const getAllPartsByDate = () => {
    const sql = `
        SELECT * FROM Parts
        ORDER BY creation_date DESC
    `;
    
    return new Promise((resolve, reject) => {
        database.all(sql, [], (err, rows) => {
            if (err) {
                console.error(`Error retrieving parts by date`, err);
                reject(new Error(`Error retrieving parts by date. Please try again later.`));
            } else {
                console.log("getAllPartsByDate:", rows)
                resolve(rows);
            }
        });
    });
}

const getPartByDate = (date) => {
    const sql = `
        SELECT * FROM Parts
        WHERE creation_date = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.get(sql, [date], (err, rows) => {
            if (err) {
                console.error(`Error retrieving part details for date: ${date}`, err);
                reject(new Error(`Error retrieving part details. Please try again later.`));
            } else {
                console.log("getPartByDate:", rows)
                resolve(rows);
            }
        });
    });
}

const createNewPart = (part_number, description, creation_date, priority_flag, part_notes, part_abb, part_prefix) => {
    const sql = `
        INSERT INTO Parts (part_number, description, creation_date, priority_flag, part_notes, part_abbreviation, part_prefix, quantity_sold)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `;
    
    return new Promise((resolve, reject) => {
        database.run(sql, [part_number, description, creation_date, priority_flag, part_notes, part_abb, part_prefix], function(err) {
            if (err) {
                console.error(`Error creating new part with part_number: ${part_number}`, err);
                reject(new Error(`Error creating new part. Please try again later.`));
            } else {
                console.log("createNewPart:", this.lastID)
                resolve(this.lastID); //Resolves the promise with the part_id of the newly created part (returns part_id)
            }
        });
    });
}

const updatePart = (part_id, updateFields) => {
    const fields = [];
    const values = [];

    //construct SQL query dynamically based on fields passed
    Object.entries(updateFields).forEach(([key, value]) => {
        fields.push(`${key} = ?`);
        values.push(value);
    });

    const sql = `UPDATE Parts SET ${fields.join(', ')} WHERE part_id = ?`;
    values.push(part_id);

    return new Promise((resolve, reject) => {
        database.run(sql, values, function(err) {
            if (err) {
                console.error(`Error updating part with part_id: ${part_id}`, err);
                reject(new Error(`Error updating part. Please try again later.`));
            } else {
                resolve(this.lastID);
            }
        });
    });
}



const updatePartNumber = (partId, part_number) => {
    const sql = `
        UPDATE Parts
        SET part_number = ?
        WHERE part_id = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.run(sql, [part_number, partId], function(err) {
            if (err) {
                console.error(`Error updating part_number for part_id: ${partId}`, err);
                reject(new Error(`Error updating part_number. Please try again later.`));
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const updatePartDescription = (partId, description) => {
    const sql = `
        UPDATE Parts
        SET description = ?
        WHERE part_id = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.run(sql, [description, partId], function(err) {
            if (err) {
                console.error(`Error updating description for part_id: ${partId}`, err);
                reject(new Error(`Error updating description. Please try again later.`));
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const updatePartNotes = (partId, part_notes) => {
    const sql = `
        UPDATE Parts
        SET part_notes = ?
        WHERE part_id = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.run(sql, [part_notes, partId], function(err) {
            if (err) {
                console.error(`Error updating part_notes for part_id: ${partId}`, err);
                reject(new Error(`Error updating part_notes. Please try again later.`));
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const updatePartAbbreviation = (partId, part_abbreviation) => {
    const sql = `
        UPDATE Parts
        SET part_abbreviation = ?
        WHERE part_id = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.run(sql, [part_abbreviation, partId], function(err) {
            if (err) {
                console.error(`Error updating part_abbreviation for part_id: ${partId}`, err);
                reject(new Error(`Error updating part_abbreviation. Please try again later.`));
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const updatePartPrefix = (partId, part_prefix) => {
    const sql = `
        UPDATE Parts
        SET part_prefix = ?
        WHERE part_id = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.run(sql, [part_prefix, partId], function(err) {
            if (err) {
                console.error(`Error updating part_prefix for part_id: ${partId}`, err);
                reject(new Error(`Error updating part_prefix. Please try again later.`));
            } else {
                resolve(this.lastID);
            }
        });
    });
}

const updatePartPriority = (partId, priority_flag) => {
    const sql = `
        UPDATE Parts
        SET priority_flag = ?
        WHERE part_id = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.run(sql, [priority_flag, partId], function(err) {
            if (err) {
                console.error(`Error updating priority_flag for part_id: ${partId}`, err);
                reject(new Error(`Error updating priority_flag. Please try again later.`));
            } else {
                resolve(this.lastID);
            }
        });
    });
}

//Here we will grab the part information that will be deleted, and put it in the deleted parts table, then remove from parts table
const softDeletePart = (part_number, deleteReason) => {
    return new Promise((resolve, reject) => {
        // First, retrieve the part to be deleted
        database.get('SELECT * FROM Parts WHERE part_number = ?', [part_number], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (!row) {
                return reject(new Error('Part not found'));
            }

            // Insert the part into the DeletedParts table
            const sqlInsert = `
                INSERT INTO DeletedParts (part_id, part_number, description, creation_date, priority_flag, part_notes, part_abb, part_prefix, quantity_sold, deleted_date, delete_reason)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            database.run(sqlInsert, [...Object.values(row), new Date().toISOString(), deleteReason], (err) => {
                if (err) {
                    return reject(err);
                }

                // Delete the part from the original Parts table
                database.run('DELETE FROM Parts WHERE part_number = ?', [part_number], (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(this.lastID)
                });
            });
        });
    });
};

const recoverDeletedPart = (part_number) => {
    return new Promise((resolve, reject) => {
        // First, retrieve the part to be recovered
        database.get('SELECT * FROM DeletedParts WHERE part_number = ?', [part_number], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (!row) {
                return reject(new Error('Part not found'));
            }

            // Insert the part into the Parts table
            const sqlInsert = `
                INSERT INTO Parts (part_id, part_number, description, creation_date, priority_flag, part_notes, part_abbreviation, part_prefix, quantity_sold)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            database.run(sqlInsert, [...Object.values(row)], (err) => {
                if (err) {
                    return reject(err);
                }

                // Delete the part from the DeletedParts table
                database.run('DELETE FROM DeletedParts WHERE part_number = ?', [part_number], (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(this.lastID);
                });
            });
        });
    });
}


module.exports = {
    getPartById,
    getPartByNumber,
    getPartByDate,
    getAllNonPriorityParts,
    getAllPartsByDate,
    getAllPriorityParts,
    getAllParts,
    createNewPart,
    updatePartNumber,
    updatePartDescription,
    updatePartNotes,
    updatePartAbbreviation,
    updatePartPrefix,
    updatePartPriority,
    softDeletePart,
    recoverDeletedPart,
    getPartid,
    updatePart
}