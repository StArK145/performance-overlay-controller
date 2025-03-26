// Store server URL in localStorage
let SERVER_URL = localStorage.getItem('serverUrl') || 'http://localhost:3000';
let overlayStatus = false;
let connectionFailed = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set the saved server URL in the input field
    document.getElementById('serverUrl').value = SERVER_URL;
    
    // Hide setup instructions if we already have a server URL
    if (localStorage.getItem('serverUrl')) {
        document.getElementById('setupInstructions').style.display = 'none';
    }
    
    // Check connection to the server
    checkConnection();
});

// Save the server URL
function saveServerUrl() {
    const url = document.getElementById('serverUrl').value.trim();
    if (url) {
        SERVER_URL = url;
        localStorage.setItem('serverUrl', url);
        document.getElementById('setupInstructions').style.display = 'none';
        checkConnection();
    }
}

// Start the overlay
function startOverlay() {
    fetch(`${SERVER_URL}/overlay/start`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        updateStatus(data.status === 'running');
        document.getElementById('connectionError').style.display = 'none';
        connectionFailed = false;
    })
    .catch(error => {
        console.error('Error starting overlay:', error);
        document.getElementById('connectionError').style.display = 'block';
        connectionFailed = true;
    });
}

// Stop the overlay
function stopOverlay() {
    fetch(`${SERVER_URL}/overlay/stop`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        updateStatus(data.status === 'running');
        document.getElementById('connectionError').style.display = 'none';
        connectionFailed = false;
    })
    .catch(error => {
        console.error('Error stopping overlay:', error);
        if (!connectionFailed) {
            document.getElementById('connectionError').style.display = 'block';
            connectionFailed = true;
        }
    });
}

// Check the status of the overlay
function checkStatus() {
    fetch(`${SERVER_URL}/overlay/status`)
    .then(response => response.json())
    .then(data => {
        updateStatus(data.status === 'running');
        document.getElementById('connectionError').style.display = 'none';
        connectionFailed = false;
    })
    .catch(error => {
        console.error('Error checking status:', error);
        if (!connectionFailed) {
            document.getElementById('connectionError').style.display = 'block';
            connectionFailed = true;
        }
        updateStatus(false);
    });
}

// Check connection to the server
function checkConnection() {
    fetch(`${SERVER_URL}/overlay/status`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('connectionError').style.display = 'none';
        connectionFailed = false;
        updateStatus(data.status === 'running');
    })
    .catch(error => {
        console.error('Error connecting to server:', error);
        document.getElementById('connectionError').style.display = 'block';
        connectionFailed = true;
        updateStatus(false);
    });
}

// Update the status display
function updateStatus(isRunning) {
    overlayStatus = isRunning;
    const statusEl = document.getElementById('status');
    
    if (isRunning) {
        statusEl.textContent = 'Overlay Status: Online';
        statusEl.className = 'status online';
    } else {
        statusEl.textContent = 'Overlay Status: Offline';
        statusEl.className = 'status offline';
    }
}

// Periodically check status
setInterval(checkStatus, 5000);