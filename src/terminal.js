// src/terminal.js
const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const { WebLinksAddon } = require('xterm-addon-web-links');

// Créez une instance du terminal
const terminal = new Terminal({
    cols: 80,
    rows: 24,
    cursorBlink: true,
    theme: {
        background: '#000000',
        foreground: '#FFFFFF'
    }
});

// Créez les addons
const fitAddon = new FitAddon();
const webLinksAddon = new WebLinksAddon();

// Ajoutez les addons au terminal
terminal.loadAddon(fitAddon);
terminal.loadAddon(webLinksAddon);

// Fonction pour initialiser le terminal
function initTerminal() {
    terminal.open(document.getElementById('terminal'));

    // Ajuste la taille du terminal au conteneur
    fitAddon.fit();

    // Exemple de commande pour tester
    terminal.writeln('Welcome to the Electron Terminal!');
    terminal.writeln('Type "help" for a list of commands.');
}

// Fonction pour gérer les entrées utilisateur
terminal.onData(data => {
    // Envoi des données au processus principal via IPC
    window.electron.handleCommand(data);
});

// Exposez les fonctions d'initialisation
module.exports = {
    initTerminal
};
