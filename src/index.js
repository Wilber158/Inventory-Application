// Function to load HTML content from a file
function loadContent(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(data => document.getElementById(containerId).innerHTML = data)
        .catch(error => console.error('Error:', error));
}

// Load content of otherpage.html into the content-container div
loadContent('sidebar.html', 'content2');
loadContent('topbar.html','content1');

document.getElementById('submitButton').addEventListener('click', function() {
    // Get all forms
    var forms = document.querySelectorAll('.partNum, .location, .vendor, .manu');

    // Submit each form
    forms.forEach(function(form) {
        form.submit();
    });
});