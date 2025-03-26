const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv")
dotenv.config()
// Express server for web control
const server = express();
const PORT = process.env.PORT;
let overlayWindow = null;

// Enable CORS for GitHub Pages
server.use(cors({
    origin: '*', // In production, you might want to restrict this
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

server.use(express.json());

// API endpoints
server.post('/overlay/start', (req, res) => {
    if (!overlayWindow) {
        createOverlayWindow();
        res.json({ status: 'running' });
    } else {
        res.json({ status: 'running' });
    }
});

server.post('/overlay/stop', (req, res) => {
    if (overlayWindow) {
        overlayWindow.close();
        overlayWindow = null;
        res.json({ status: 'stopped' });
    } else {
        res.json({ status: 'stopped' });
    }
});

server.get('/overlay/status', (req, res) => {
    res.json({ status: overlayWindow ? 'running' : 'stopped' });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Control your overlay from GitHub Pages at https://yourusername.github.io/performance-overlay-controller`);
});

function createOverlayWindow() {
    overlayWindow = new BrowserWindow({
        width: 150,
        height: 70,
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
    });

    // Set window position to top-right corner
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width } = primaryDisplay.workAreaSize;
    overlayWindow.setBounds({ x: width - 160, y: 10, width: 150, height: 70 });

    // Load the overlay HTML
    overlayWindow.loadFile('index.html');
    
    // Handle window close
    overlayWindow.on('closed', () => {
        overlayWindow = null;
    });
}

// IPC for controlling overlay from other processes if needed
ipcMain.on('toggle-overlay', (event, action) => {
    if (action === 'start' && !overlayWindow) {
        createOverlayWindow();
    } else if (action === 'stop' && overlayWindow) {
        overlayWindow.close();
        overlayWindow = null;
    }
});

// Auto-start server when app launches
app.whenReady().then(() => {
    // Create a small systray icon or notification to show the app is running
    console.log("Performance Overlay app is running");
    console.log("Control panel available at http://localhost:3000");
});

app.on('window-all-closed', () => {
    // Don't quit when all windows are closed
    // This keeps the server running
});

app.on('activate', () => {
    // Mac OS behavior
    if (BrowserWindow.getAllWindows().length === 0) {
        // Don't create window on activate
    }
});