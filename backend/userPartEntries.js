const partsCRUD = require('./CRUD/parts.js');



//part_id, part_number, description, creation_date, priority_flag, part_notes, part_abbreviation, quantity_sold

async function createUserPart(part_prefix, part_number, description, priority_flag, part_notes, part_abbreviation, quantity_sold){
    let date = new Date().toISOString();

    try{
        let part_id = await createNewPart(part_prefix, part_number, date, description, priority_flag, part_notes, part_abbreviation, quantity_sold);
        return part_id;
    } catch (err) {
        console.log(err);
        throw new Error("Error creating part from user input")
    }
}

async function updateUserPart(part_id, part_number, description, priority_flag, part_notes, part_abbreviation, quantity_sold) {
    let updateFields = {};
    let date = new Date().toISOString();

    try{
        if (part_number != null) updateFields.part_number = part_number;
        if (description != null) updateFields.description = description;
        if (priority_flag != null) updateFields.priority_flag = priority_flag;
        if (part_notes != null) updateFields.part_notes = part_notes;
        if (part_abbreviation != null) updateFields.part_abbreviation = part_abbreviation;
        if (quantity_sold != null) updateFields.quantity_sold = quantity_sold;
        updateFields.creation_date = date; //always update this field

        //update the part
        await partsCRUD.updatePart(part_id, updateFields);
        console.log("updated part");
        return part_id;

    } catch(error){
        console.error("Error updating part from user input", error);
        throw new Error("Error updating part from user input")
    }
}



module.exports = {
    createUserPart,
    updateUserPart
}