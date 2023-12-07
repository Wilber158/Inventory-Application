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
        let vendor_id;
        if (vendor_name){
            let vendor_id = await getOrCreateVendor(vendor_name);
        }
        let date_last_updated = new Date().toISOString();
        let inventory_entry_id = await entriesCRUD.createInventoryEntry(part_id, location_id, quantity, date_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price, part_type);
        console.log("created inventory entry");
        return inventory_entry_id;
    } catch (err) {
        console.log(err);
        throw new Error("Error creating inventory entry from user input")
    }
}

//loops through data and calls createUserInventoryEntry for each row
async function bulkCreateUserInventoryEntry(data) {
    // Filter out null rows
    const filteredData = data.filter(row => row != null);

    for (const row of filteredData) {
        for (const property in row) {
            if (row[property] === "" || row[property] == null) {
                row[property] = null;
            }
            if (property === "unitCost" && row[property] != null) {
                row[property] = parseInt(row[property].replace('$', ''));
            }
        }
    }

    try {
        const promises = filteredData.map(row => 
            createUserInventoryEntry(row.partPrefix, row.partNumber, row.quantity, row.warehouse, row.zone, row.vendor, row.manufacturer, row.condition, row.unitCost, row.entryNotes, null, row.type)
        );
        await Promise.all(promises);
    } catch (err) {
        console.log(err);
        throw new Error("Error creating inventory in bulkCreateUserInventoryEntry");
    }
}

//part_prefix, part_number and warehouse_name, zone_name MUST be sent in pairs if any of them are to be updated 
//Assumptions: inventory_entry_id, part_prefix, part_number, quantity are not NULL
async function updateUserInventoryEntry(row){
    console.log("row in updateUserInventoryEntry: ", row);
    //loop through the row and validate the data
    try{
        for (const property in row) {
            if(row[property] == "" || !row[property]){
                row[property] = " ";
            }
            else if(property === "unit_cost" && row[property] != null) {
                row[property] = parseInt(row[property].replace('$', ''));
            }
            else if(property === "quantity" && row[property] != null){
                row[property] = parseInt(row[property]);
            }
            else if(property === "part_number"){
                row[property] = row[property].toString();
                row[property] = row[property].toUpperCase();
                row[property] = row[property].trim();
            }
            else{
                row[property] = row[property].toString();
            }
        }
    }catch(err){
        console.log(err);
        throw new Error("Error validating user input in updateUserInventoryEntry")
    }
        

    let updateFields = {};
    let date_last_updated = new Date().toISOString();
    let part_id, location_id, vendor_id;
    try{
        part_id = await getOrCreatePart(row.part_prefix, row.part_number);
        location_id = await getOrCreateLocation(null, row.zone_name, row.warehouse_name, null);
        if (row.vendor_name){
            vendor_id = await getOrCreateVendor(row.vendor_name);
            updateFields.vendor_id = vendor_id;
        }

    }catch(err){
        console.log(err);
        throw new Error("Error getting or creating part, location or vendor in updateUserInventoryEntry")
    }
    try{
       //loop through the row and add the fields to the updateFields object
         for (const property in row) {
              if(property === "part_prefix" || property === "part_number" || property === "warehouse_name" || property === "zone_name" || property === "vendor_name" || property == "inventory_entry_id"){
                continue;
              }
              if(row[property]){
                updateFields[property] = row[property];
              }
         }
         updateFields.part_id = part_id;
         updateFields.location_id = location_id;
         updateFields.date_last_updated = date_last_updated;
         console.log("UpdateFields in userUpdateInventory: ", updateFields);
         await entriesCRUD.updateInventoryEntry(row.inventory_entry_id, updateFields);
    }catch(err){
        console.log(err);
        throw new Error("Error adding fields to updateFields object in updateUserInventoryEntry")
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
//get the deleted inventory entries and part_name, part_number, warehouse_name, zone_name, vendor_name
const getDeletedInventoryEntries = async () => {
    try{
        let deletedEntries = await entriesCRUD.getDeletedInventoryEntries();
        for (const entry of deletedEntries) {
            let part = await partsCRUD.getPartById(entry.part_id);
            let location = await locationsCRUD.getLocationById(entry.location_id);
            let warehouse = await warehouseCRUD.getWarehouseById(location.warehouse_id);
            let zone = await zoneCRUD.getZone(location.zone_id);
            let vendor = entry.vendor_id ? await vendorsCRUD.getVendor(entry.vendor_id) : null;
            entry.part_name = part.part_name;
            entry.part_number = part.part_number;
            entry.part_prefix = part.part_prefix;
    
            entry.warehouse_name = warehouse.warehouse_name;
            entry.zone_name = zone.zone_name;
            entry.vendor_name = vendor ? vendor.vendor_name : null;

        }
        return deletedEntries;
    }catch(err){
        console.log(err);
        throw new Error("Error performing getDeletedInventoryEntries")
    }
}

const restoreInventoryEntry = async (inventory_entry_id) => {
    try{
        await entriesCRUD.recoverDeletedPart(inventory_entry_id);
    }catch(err){
        console.log(err);
        throw new Error("Error performing restoreInventoryEntry")
    }
}
    


module.exports = {
    createUserInventoryEntry,
    updateUserInventoryEntry,
    getInventoryEntry,
    deleteInventoryEntry,
    bulkCreateUserInventoryEntry,
    getDeletedInventoryEntries,
    restoreInventoryEntry
}


