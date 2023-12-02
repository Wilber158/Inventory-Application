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

document.getElementById('submitButton').addEventListener('click', function() {
        // Get all forms
        var forms = document.querySelectorAll('.partNum, .location, .vendor, .manu');

        // Submit each form
        forms.forEach(function(form) {
            form.submit();
        });
    });
