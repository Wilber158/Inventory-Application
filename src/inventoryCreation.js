const { ipcMain } = require('electron');
const userEntries = require('./backend/userEntries.js');


ipcMain.on('create-inventory-entry', handleCreateUserInventoryEntry);


////part_id, location_id, quantity, data_last_updated, vendor_id, manufacturer, condition, unit_cost, entry_notes, sell_price
async function handleCreateUserInventoryEntry(event, part_prefix, part_number, quantity, warehouse_name, zone_name, vendor_name, manufacturer, condition, unit_cost, entry_notes, sell_price){
    //validate input
    if(typeof part_prefix !== 'string'){
        try{
            part_prefix = part_prefix.toString();
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because part_prefix is not a string")});
            return;
        }
    }
    if(typeof part_number !== 'string'){
        try{
            part_number = toString(part_number);
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because part_number is not a string")});
            return;
        }
    }
    if(typeof warehouse_name !== 'string'){
        try{
            warehouse_name = warehouse_name.toString();
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because warehouse_name is not a string")});
            return;
        }
    }
    if(typeof zone_name !== 'string'){
        try{
            zone_name = zone_name.toString();
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because zone_name is not a string")});
            return;
        }
    }
    if(typeof vendor_name !== 'string' && vendor_name !== null){
        try{
            vendor_name = vendor_name.toString();
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because vendor_name is not a string")});
            return;
        }
    }

    if(typeof quantity !== 'number'){
        try{
            quantity = parseInt(quantity);
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because quantity is not a number")});
            return;
        }
    }

    if(typeof manufacturer !== 'string' && manufacturer !== null){
        try{
            manufacturer = manufacturer.toString();
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because manufacturer is not a string")});
            return;
        }
    }
    if(typeof condition !== 'string'){
        try{
            condition = condition.toString();
            condition = condition.toUpperCase();
            condition = condition.trim();
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because condition is not a string")});
            return;
        }
    }
    if(typeof unit_cost !== 'number' && unit_cost !== null){
        try{
            unit_cost = parseFloat(unit_cost);
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because unit_cost is not a number")});
            return;
        }
    }
    if(typeof entry_notes !== 'string' && entry_notes !== null){
        try{
            entry_notes = entry_notes.toString();
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because entry_notes is not a string")});
            return;
        }
    }
    if(typeof sell_price !== 'number' && sell_price !== null){
        try{
            sell_price = parseFloat(sell_price);
        }
        catch(err){
            console.error(err);
            event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry because sell_price is not a number")});
            return;
        }
    }

    //create the inventory entry
    try{
        let inventory_entry_id = await userEntries.createUserInventoryEntry(part_prefix, part_number, quantity, warehouse_name, zone_name, vendor_name, manufacturer, condition, unit_cost, entry_notes, sell_price);
        event.reply('createUserInventoryEntryReply', { success: true, inventory_entry_id });      
        return inventory_entry_id;
    } catch (err) {
        console.error(err);
        event.reply('createUserInventoryEntryReply', {error: new Error("Error creating inventory entry from user input")});
        return;
    }
    
}

ipcMain.on('update-inventory-entry', handleUpdateUserInventoryEntry);

async function handleUpdateUserInventoryEntry(event, inventory_entry_id, part_prefix, part_number, quantity, warehouse_name, zone_name, vendor_name, manufacturer, condition, unit_cost, entry_notes, sell_price){
    //validate input
    if(typeof inventory_entry_id !== 'number'){
        try{
            inventory_entry_id = parseInt(inventory_entry_id);
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because inventory_entry_id is not a number")});
            return;
        }
    }
    if(typeof part_prefix !== 'string'){
        try{
            part_prefix = part_prefix.toString();
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because part_prefix is not a string")});
            return;
        }
    }
    if(typeof part_number !== 'string'){
        try{
            part_number = toString(part_number);
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because part_number is not a string")});
            return;
        }
    }
    if(typeof warehouse_name !== 'string'){
        try{
            warehouse_name = warehouse_name.toString();
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because warehouse_name is not a string")});
            return;
        }
    }
    if(typeof zone_name !== 'string'){
        try{
            zone_name = zone_name.toString();
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because zone_name is not a string")});
            return;
        }
    }
    if(typeof vendor_name !== 'string' && vendor_name !== null){
        try{
            vendor_name = vendor_name.toString();
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because vendor_name is not a string")});
            return;
        }
    }

    if(typeof quantity !== 'number' && quantity !== null){
        try{
            quantity = parseInt(quantity);
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because quantity is not a number")});
            return;
        }
    }

    if(typeof manufacturer !== 'string' && manufacturer !== null){
        try{
            manufacturer = manufacturer.toString();
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because manufacturer is not a string")});
            return;
        }
    }
    if(typeof condition !== 'string'){
        try{
            condition = condition.toString();
            condition = condition.toUpperCase();
            condition = condition.trim();
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because condition is not a string")});
            return;
        }
    }
    if(typeof unit_cost !== 'number' && unit_cost !== null){
        try{
            unit_cost = parseFloat(unit_cost);
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because unit_cost is not a number")});
            return;
        }
    }
    if(typeof entry_notes !== 'string' && entry_notes !== null){
        try{
            entry_notes = entry_notes.toString();
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because entry_notes is not a string")});
            return;
        }
    }
    if(typeof sell_price !== 'number' && sell_price !== null){
        try{
            sell_price = parseFloat(sell_price);
        }
        catch(err){
            console.error(err);
            event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry because sell_price is not a number")});
            return;
        }
    }

    //update the inventory entry
    try{
        await userEntries.updateUserInventoryEntry(inventory_entry_id, part_prefix, part_number, quantity, warehouse_name, zone_name, vendor_name, manufacturer, condition, unit_cost, entry_notes, sell_price);
        event.reply('updateUserInventoryEntryReply', { success: true });
    } catch (err) {
        console.error(err);
        event.reply('updateUserInventoryEntryReply', {error: new Error("Error updating inventory entry from user input")});
    }
}