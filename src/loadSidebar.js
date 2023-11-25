function loadSidebar(){
    fetch("sidebar.html")
    .then(response => {
        return response.text()
    })
}

