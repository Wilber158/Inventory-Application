async function loadSidebar() {
    try {
        const response = await fetch('./sidebar.html');
        const content = await response.text();
        document.getElementById('sidebar-container').innerHTML = content;
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }
}

window.onload = loadSidebar;

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Get values from the form inputs
        const formData = {
            prefix: document.getElementById('prefix').value,
            partNumber: document.getElementById('partNumber').value,
            type: document.getElementById('type').value,
            condition: document.getElementById('condition').value,
            warehouse: document.getElementById('warehouse').value,
            zone: document.getElementById('zone').value,
            quantity: document.getElementById('quantity').value,
            seller: document.getElementById('seller').value,
            unitCost: document.getElementById('cost').value,
            manufacturer: document.getElementById('manufacturer').value,
            notes: document.getElementById('notes').value
        };

        //loop over formData and print to console type and value
        for (const property in formData) {
            console.log(`${property}: ${formData[property]}`);
        }


        //validate the form data
        //TODO
        //if(!valid)
        // Send the form data to the main process
        window.electronAPI.submit_Add_Entry(formData);

        // Listen for the response from the main process
        window.electronAPI.submit_Add_Entry_Response((result) => {
            //handle the response, ex: send to a new page
            console.log(result);
            console.log("Holy shit it worked")
        });
    });
});
