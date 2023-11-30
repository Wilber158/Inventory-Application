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

async function updateUserInventoryEntry(inventory_entry_id, part_prefix, part_number, quantity, warehouse_name, zone_name, vendor_name, manufacturer, condition, unit_cost, entry_notes, sell_price){
    try{
        let part_id = await getOrCreatePart(part_prefix, part_number);
        let location_id = await getOrCreateLocation(zone_name, warehouse_name);
        let vendor_id = await getOrCreateVendor(vendor_name);
        
        let date_last_updated = new Date().toISOString();
        let updateFields = {
            part_id: part_id,
            location_id: location_id,
            quantity: quantity,
            date_last_updated: date_last_updated,
            vendor_id: vendor_id,
            manufacturer: manufacturer,
            condition: condition,
            unit_cost: unit_cost,
            entry_notes: entry_notes,
            sell_price: sell_price
        }

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


