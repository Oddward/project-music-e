// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process
module.exports = {};

import * as mm from 'music-metadata'
import * as util from 'util'
import * as path from 'path'
// import { metadata } from 'core-js/fn/reflect';

// let closeWindow = () => {
//     const remote = (window.require) ? window.require("electron").remote : null;
//     const WIN = remote.getCurrentWindow();
//     WIN.close();
// }

// VARIABLES
const x = document.getElementById('close-button');
const audio: HTMLAudioElement = document.getElementById('current-audio') as HTMLAudioElement;
const song = document.getElementById('track-name');
const artist = document.getElementById('artist-name');
const cover: HTMLImageElement = document.getElementById('cover-art') as HTMLImageElement;
const playbutt = document.getElementById('play-pause-butt') as HTMLButtonElement;

console.log(x);
console.log(audio);
console.log(song);
console.log(artist);
console.log(cover);
console.log(playbutt);

x.addEventListener( 'click', event => {
    // closeWindow()
    console.log(event)
});

(async () => {
    try {
        const metadata = await mm.parseFile(path.join(__dirname,'../src/media/GOMD Video - J. Cole.mp3'))
        console.log(util.inspect(metadata, { showHidden:false, depth:null }))

        song.textContent = metadata.common.artist
        artist.textContent = metadata.common.title
        const picture = metadata.common.picture[0]
        cover.style.background = `data:${picture.format};base64,${picture.data.toString('base64')}`;
    } catch (error) {
        console.error(error.message);
    }
})();

const playPause = () => {
    if (audio.paused) {
        audio.play()
        cover.classList.add('playing')
    } else {
        audio.pause()
        cover.classList.remove('playing')
    }
};

// playbutt.addEventListener('click', event => {
//     playPause()
//     console.log(event)
// })
playbutt.onclick = () => playPause();