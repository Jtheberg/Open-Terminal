const { initTerminal } = require('./terminal');

document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme-select');
    const uploadInput = document.getElementById('upload-input');
    const uploadButton = document.getElementById('upload-button');

    // Initialiser le terminal
    initTerminal();

    window.electron.getThemes((themes) => {
        themes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.name;
            option.textContent = theme.name;
            themeSelect.appendChild(option);
        });
    });

    themeSelect.addEventListener('change', (event) => {
        const theme = event.target.value;
        const filePath = `themes/${theme}/style.css`;
        fetch(filePath)
            .then(response => response.text())
            .then(css => {
                const styleSheet = document.createElement('style');
                styleSheet.type = 'text/css';
                styleSheet.innerText = css;
                document.head.appendChild(styleSheet);
            })
            .catch(error => console.error('Erreur lors du chargement du thème:', error));
    });

    uploadButton.addEventListener('click', () => {
        const file = uploadInput.files[0];
        if (file) {
            window.electron.uploadTheme(file);
        }
    });

    window.electron.onUploadSuccess((message) => {
        alert(message);
    });

    window.electron.onUploadError((message) => {
        alert(message);
    });
});
