const locationsCRUD = require('./CRUD/locations.js');



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

module.exports = {
    getLocationRows
}