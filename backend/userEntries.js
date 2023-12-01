//logic that handles the user entries and inputs into database

const partsCRUD = require('./CRUD/parts.js');
const entriesCRUD = require('./CRUD/inventory_entries.js');
const locationsCRUD = require('./CRUD/locations.js');
const warehouseCRUD = require('./CRUD/warehouse.js');
const vendorsCRUD = require('./CRUD/vendors.js');
const sellPointCRUD = require('./CRUD/sellPoint.js');
const additionsCRUD = require('./CRUD/additions.js');

//part_id, location_id, quantity, data_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price
async function createUserInventoryEntry(part_prefix, part_number, quantity, warehouse_name, zone_name, vendor_name, manufacturer, condition, unit_cost, entry_notes, sell_price){
    try{
        let part_id = await getOrCreatePart(part_prefix, part_number);
        let location_id = await getOrCreateLocation(zone_name, warehouse_name);
        let vendor_id = await getOrCreateVendor(vendor_name);

        let date_last_updated = new Date().toISOString();
        let inventory_entry_id = await entriesCRUD.createInventoryEntry(part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price);
        return inventory_entry_id;
    } catch (err) {
        console.log(err);
        throw new Error("Error creating inventory entry from user input")
    }
}

//part_prefix, part_number and warehouse_name, zone_name MUST be sent in pairs if any of them are to be updated 
async function updateUserInventoryEntry(inventory_entry_id, part_prefix, part_number, quantity, warehouse_name, zone_name, vendor_name, manufacturer, condition, unit_cost, entry_notes, sell_price){
    let updateFields = {};
    let date_last_updated = new Date().toISOString();
    try{
        if(!part_prefix && !part_number){
            let part_id = await getOrCreatePart(part_prefix, part_number);
            updateFields.part_id = part_id;
        }
        if(!warehouse_name && !zone_name){
            let location_id = await getOrCreateLocation(zone_name, warehouse_name);
            updateFields.location_id = location_id;
        }
        if(!vendor_name){
            let vendor_id = await getOrCreateVendor(vendor_name);
            updateFields.vendor_id = vendor_id;
        }
        if (quantity != null) updateFields.quantity = quantity;
        updateFields.date_last_updated = date_last_updated; //always update this field
        if (vendor_id != null) updateFields.vendor_id = vendor_id;
        if (manufacturer != null) updateFields.manufacturer = manufacturer;
        if (condition != null) updateFields.condition = condition;
        if (unit_cost != null) updateFields.unit_cost = unit_cost;
        if (entry_notes != null) updateFields.entry_notes = entry_notes;
        if (sell_price != null) updateFields.sell_price = sell_price;

        //update the inventory entry
        await entriesCRUD.updateInventoryEntry(inventory_entry_id, updateFields);
        console.log("updated inventory entry");
        return inventory_entry_id;

    } catch(error){
        console.error("Error updating inventory entry from user input", error);
        throw new Error("Error updating inventory entry from user input")
    }
}

const getOrCreatePart = async (part_prefix, part_number, description, priority_flag, part_notes, part_abbreviation, quanitity_sold) => {
    let part_id = await partsCRUD.getPart_id(part_prefix, part_number);
    if(!part_id){
        var date = new Date().toISOString();
        part_id = await partsCRUD.createPart(part_number, description, date, priority_flag, part_notes, part_abbreviation, part_prefix, quantity_sold);
    }
    return part_id
}

const getOrCreateLocation = async (location_notes, zone_name, warehouse_name, single_part_only) => {
    let location_id = await locationsCRUD.getLocation_id(zone_name, warehouse_name);
    if(!location_id){
        location_id = await locationsCRUD.createLocation(location_notes, zone_name, warehouse_name, single_part_only);
    }
    return location_id
}

const getOrCreateVendor = async (vendor_name, vendor_notes) => {
    let vendor_id = await vendorsCRUD.getVendor_id(vendor_name);
    if(!vendor_id){
        vendor_id = await vendorsCRUD.createVendor(vendor_name, vendor_notes);
    }
    return vendor_id
}


module.exports = {
    createUserInventoryEntry,
    updateUserInventoryEntry
}


