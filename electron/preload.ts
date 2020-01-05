import electron from 'electron';

window.addEventListener('DOMContentLoaded', () => {
  window.ipcRenderer = electron.ipcRenderer;
});

export {};
