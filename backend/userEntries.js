//logic that handles the user entries and inputs into database

const partsCRUD = require('./CRUD/parts.js');
const entriesCRUD = require('./CRUD/inventory_entries.js');
const locationsCRUD = require('./CRUD/locations.js');
const warehouseCRUD = require('./CRUD/warehouse.js');
const zoneCRUD = require('./CRUD/zone.js');
const vendorsCRUD = require('./CRUD/vendors.js');

//part_id, location_id, quantity, data_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price
async function createUserInventoryEntry(part_prefix, part_number, quantity, warehouse_name, zone_name, vendor_name, manufacturer, condition, unit_cost, entry_notes, sell_price, part_type){
    try{
        console.log("Currently in createUserInventoryEntry")
        let part_id = await getOrCreatePart(part_prefix, part_number);
        let location_id = await getOrCreateLocation(null, zone_name, warehouse_name, null);
        let vendor_id = await getOrCreateVendor(vendor_name);

        let date_last_updated = new Date().toISOString();
        console.log("part_id in createUserInventoryEntry: ", part_id)
        console.log("type of part_id in createUserInventoryEntry: ", typeof part_id)
        console.log("location_id in createUserInventoryEntry: ", location_id)
        console.log("type of location_id in createUserInventoryEntry: ", typeof location_id)
        console.log("vendor_id in createUserInventoryEntry: ", vendor_id)
        console.log("type of vendor_id in createUserInventoryEntry: ", typeof vendor_id)
        let inventory_entry_id = await entriesCRUD.createInventoryEntry(part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price, part_type);
        console.log("created inventory entry");
        return inventory_entry_id;
    } catch (err) {
        console.log(err);
        throw new Error("Error creating inventory entry from user input")
    }
}

//part_prefix, part_number and warehouse_name, zone_name MUST be sent in pairs if any of them are to be updated 
async function updateUserInventoryEntry(inventory_entry_id, part_prefix, part_number, quantity, warehouse_name, zone_name, vendor_name, manufacturer, condition, unit_cost, entry_notes, sell_price, part_type){
    let updateFields = {};
    let date_last_updated = new Date().toISOString();
    try{
        if(!part_prefix && !part_number){
            let part_id = await getOrCreatePart(part_prefix, part_number);
            updateFields.part_id = part_id;
        }
        if(!warehouse_name && !zone_name){
            let location_id = await getOrCreateLocation(null, zone_name, warehouse_name);
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
        if (part_type != null) updateFields.part_type = part_type;

        //update the inventory entry
        await entriesCRUD.updateInventoryEntry(inventory_entry_id, updateFields);
        console.log("updated inventory entry");
        return inventory_entry_id;

    } catch(error){
        console.error("Error updating inventory entry from user input", error);
        throw new Error("Error updating inventory entry from user input")
    }
}

//this function will validate the user input and return the inventory entry
const getInventoryEntry = async (formData) => {
    let inventory_entry;
    //loop through the formData and validate the data
    for (const property in formData) {
        if(formData[property] == "" || formData[property] == null){
            formData[property] = null;
        }
    }
    try{
        inventory_entry = await entriesCRUD.getSpecificInventoryEntry(formData);
    }catch(err){
        console.log(err);
        throw new Error("Error getting inventory entry from user input")
    }

    console.log("inventory_entry returned by getInventoryEntry: ", inventory_entry)
    return inventory_entry;
}



const getOrCreatePart = async (part_prefix, part_number, description, priority_flag, part_notes, part_abbreviation, quantity_sold) => {
    let part_id = await partsCRUD.getPartid(part_prefix, part_number);
    console.log("Currently in getOrCreatePart")
    console.log("Part_id returned by getPartid: ", part_id)
    if(!part_id){
        console.log("Part does not exist, creating new part")
        var date = new Date().toISOString();
        part_id = await partsCRUD.createNewPart(part_number, description, date, priority_flag, part_notes, part_abbreviation, part_prefix, quantity_sold);
        console.log("Part_id returned by createNewPart: ", part_id)
    }
    return part_id
}

const getOrCreateLocation = async (location_notes, zone_name, warehouse_name, single_part_only) => {
    let location_id, zone_id, warehouse_id; //Declare variables due to let scope
    try{
        zone_id = await getOrcreateZone(zone_name);
        console.log("Zone_id returned: ", zone_id)
    }
    catch(err){
        console.log(err);
        throw new Error("Error performing getOrcreateZone in getOrCreateLocation")
    }

    try{
        warehouse_id = await getOrCreateWarehouse(warehouse_name);
        console.log("Warehouse_id returned in getOrCreateLocation: ", warehouse_id)
    }
    catch(err){
        console.log(err);
        throw new Error("Error performing getOrCreateWarehouse in getOrCreateLocation")
    }

   try{
    location_id = await locationsCRUD.getLocation_id(zone_id, warehouse_id);
    console.log("Location_id returned by getLocation_id: ", location_id)
   }catch(err){
    console.log(err);
    throw new Error("Error performing getLocation_id in getOrCreateLocation")
   }

    if(!location_id){
        console.log("Location does not exist, creating new location")
        location_id = await locationsCRUD.createLocation(location_notes, zone_id, warehouse_id, single_part_only);
        console.log("Location_id returned by createLocation: ", location_id)
    }
    return location_id
}

const getOrCreateVendor = async (vendor_name, vendor_notes) => {
    let vendor_id = await vendorsCRUD.getVendor_id(vendor_name);
    if(!vendor_id){
        console.log("Vendor does not exist, creating new vendor")
        vendor_id = await vendorsCRUD.createVendor(vendor_name, vendor_notes);
    }
    return vendor_id
}

const getOrcreateZone = async (zone_name) => {
    let zone_id = await zoneCRUD.getZone_id(zone_name);
    if(!zone_id){
        console.log("Zone does not exist, creating new zone")
        zone_id = await zoneCRUD.createZone(zone_name);
    }
    return zone_id
}

const getOrCreateWarehouse = async (warehouse_name) => {
    let warehouse_id = await warehouseCRUD.getWarehouse_id(warehouse_name);
    if(!warehouse_id){
        console.log("Warehouse does not exist, creating new warehouse")
        warehouse_id = await warehouseCRUD.createWarehouse(warehouse_name);
    }
    console.log("Warehouse_id returned by getOrCreateWarehouse: ", warehouse_id)
    return warehouse_id
}

const deleteInventoryEntry = async (inventory_entry_id) => {
    try{
        await entriesCRUD.softDeleteInventoryEntry(inventory_entry_id);
    }catch(err){
        console.log(err);
        throw new Error("Error performing deleteInventoryEntry")
    }
}
    


module.exports = {
    createUserInventoryEntry,
    updateUserInventoryEntry,
    getInventoryEntry,
    deleteInventoryEntry
}


