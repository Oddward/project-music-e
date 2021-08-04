// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// const WaveSurfer = require('wavesurfer.js')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const { contextBridge, ipcRenderer } = require('electron')

// Set up context bridge between renderer & main
contextBridge.exposeInMainWorld( 'windowControls', {
  close: () => ipcRenderer.send('windowControls:close'),
  maximize: () => ipcRenderer.send('windowControls:maximize'),
  minimize: () => ipcRenderer.send('windowControls:minimize')
})

// music-metadata for gettint track file information
const mm = require('music-metadata')

contextBridge.exposeInMainWorld( 'musicMetadata', {
  getCommonMetadata ( data ) {
        return mm.parseBuffer( data ).common
  }
})
