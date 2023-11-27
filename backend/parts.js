const database = require('database.js');

const getAllParts = () => {
    const sql = `
        SELECT * FROM Parts
    `;
    
    return new Promise((resolve, reject) => {
        database.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const getPartById = (partId) => {
    const sql = `
        SELECT * FROM Parts
        WHERE part_id = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.get(sql, [partId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const getPartByName = (partName) => {
    const sql = `
        SELECT * FROM Parts
        WHERE part_number = ?
    `;
    
    return new Promise((resolve, reject) => {
        database.get(sql, [partName], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
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
                reject(err);
            } else {
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
                reject(err);
            } else {
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
                reject(err);
            } else {
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
        database.get(sql, [date], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const createNewPart = (part_number, description, creation_date, priority_flag, part_notes, part_abb, part_prefix) => {
    const sql = `
        INSERT INTO Parts (part_number, description, creation_date, priority_flag, part_notes, part_abbreviation, part_prefix)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {
        database.run(sql, [part_number, description, creation_date, priority_flag, part_notes, part_abb, part_prefix], function(err) {
            if (err) {
                reject(err);
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
                reject(err);
            } else {
                resolve(null);
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
                reject(err);
            } else {
                resolve(null);
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
                reject(err);
            } else {
                resolve(null);
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
                reject(err);
            } else {
                resolve(null);
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
                reject(err);
            } else {
                resolve(null);
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
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

//deletion functions are not yet implemented



