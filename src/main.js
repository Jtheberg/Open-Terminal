const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const unzipper = require('unzipper');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');
}

// Vérifier les mises à jour
ipcMain.handle('check-update', async (event, version) => {
    try {
        const response = await axios.get('http://node1.jtheberg.fr:25575/check-update', {
            params: { version }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la vérification des mises à jour:', error);
        return { updateAvailable: false };
    }
});

// Télécharger la mise à jour
ipcMain.handle('download-update', async () => {
    try {
        const response = await axios.get('http://node1.jtheberg.fr:25575/download-update', {
            responseType: 'stream'
        });

        const updatePath = path.join(__dirname, 'updates', 'app-update.zip');
        response.data.pipe(fs.createWriteStream(updatePath));

        // Décompresser la mise à jour
        response.data.on('end', () => {
            fs.createReadStream(updatePath)
                .pipe(unzipper.Extract({ path: path.join(__dirname, 'updates') }))
                .promise()
                .then(() => console.log('Mise à jour téléchargée et extraite.'));
        });
    } catch (error) {
        console.error('Erreur lors du téléchargement de la mise à jour:', error);
    }
});

// Obtenir les thèmes approuvés
ipcMain.handle('get-themes', async () => {
    try {
        const response = await axios.get('http://node1.jtheberg.fr:25575/themes');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des thèmes:', error);
    }
});

// Upload d'un thème
ipcMain.handle('upload-theme', async (event, formData) => {
    try {
        const response = await axios.post('http://node1.jtheberg.fr:25575/upload-theme', formData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'upload du thème:', error);
    }
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
