const locationsCRUD = require('./CRUD/locations.js');
const warehouseCRUD = require('./CRUD/warehouse.js');
const zoneCRUD = require('./CRUD/zone.js');



const getLocationRows = async (formData) => {
    let locations;
    //loop through the formData and validate the data
    for (const property in formData) {
        if(formData[property] == "" || formData[property] == null){
            formData[property] = null;
        }
    }
    try{
        locations = await locationsCRUD.getSpecificLocation(formData);
    }catch(err){
        console.log(err);
        throw new Error("Error getting inventory entry from user input")
    }

    console.log("locations returned in getLocationRows", locations)
    return locations;
}

const updateLocationEntry = async (formData) => {
    console.log("Form data in updateLocationEntry: ", formData);
    let location_id = formData.location_id;
    delete formData.location_id;
    try{
        for (const property in formData) {
            if(property == "warehouse_name" || property == "zone_name"){
                if (!formData[property]) {
                    throw new Error("Warehouse name and zone name cannot be empty");
                }
            }
            else if(property == "single_part_only"){
                formData[property] = formData[property].toLowerCase();
                formData[property] = formData[property].trim();
                if (formData[property] != "true" && formData[property] != "false") {
                    throw new Error("Single part only must be true or false");
                }
                else if(formData[property] == "true"){
                    formData[property] = 1;
                }
                else if(formData[property] == "false"){
                    formData[property] = 0;
                }
            }
            else if(formData[property] == "" || formData[property] == null){
                console.log("Property being nulled: ", property, " with value: ", formData[property]);
                formData[property] = null;
            }
        }

        //transfer information onto new object
        
        let zone_id = await getOrCreateZone(formData.zone_name);
        let warehouse_id = await getOrCreateWarehouse(formData.warehouse_name);
        formData.zone_id = zone_id;
        formData.warehouse_id = warehouse_id;
        delete formData.zone_name;
        delete formData.warehouse_name;
        console.log("Form data after getOrCreateZone and getOrCreateWarehouse: ", formData);
        location_id = parseInt(location_id);
        await locationsCRUD.updateLocation(location_id, formData);
    }catch(err){
        console.log(err);
        throw new Error("Error updating inventory entry from user input")
    }
}

const getOrCreateZone = async (zone_name) => {
    let zone_id = await zoneCRUD.getZone_id(zone_name);
    console.log("Currently in getOrCreateZone")
    console.log("Zone_id returned by getZoneid: ", zone_id)
    if(!zone_id){
        console.log("Zone does not exist, creating new zone")
        zone_id = await zoneCRUD.createZone(zone_name);
        console.log("Zone_id returned by createNewZone: ", zone_id)
    }
    return zone_id
}

const getOrCreateWarehouse = async (warehouse_name) => {
    let warehouse_id = await warehouseCRUD.getWarehouse_id(warehouse_name);
    console.log("Currently in getOrCreateWarehouse")
    console.log("Warehouse_id returned by getWarehouseid: ", warehouse_id)
    if(!warehouse_id){
        console.log("Warehouse does not exist, creating new warehouse")
        warehouse_id = await warehouseCRUD.createWarehouse(warehouse_name);
        console.log("Warehouse_id returned by createNewWarehouse: ", warehouse_id)
    }
    return warehouse_id
}


module.exports = {
    getLocationRows, 
    updateLocationEntry
}