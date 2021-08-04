// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process. 
// - Use ipcRenderer(), contextBridge()

// VARIABLES
const x = document.querySelector('#close-button')
const maximize = document.querySelector('#max-button')
const minimize = document.querySelector('#min-button')

const audio = document.querySelector('.current-audio')
const title = document.querySelector('.track-name')
const artist = document.querySelector('.artist-name')
const cover = document.querySelector('.cover-art')
const playbutt = document.querySelector('.play-pause-butt')

let duration = 0
let seekTime = 0
let currentTime = 0
const seekBar = document.querySelector('.seekbar')

let trackIndex = 0

let inputFile = document.getElementById('audio-file')
// inputFile.style.display('none')
// let fileIndex = 0

// Bind window controls exposed by contextBridge in preload.js
// * If they're not clickable, right click for context menu instead
x.addEventListener('click', () => windowControls.close() )
maximize.addEventListener('click', () => windowControls.maximize() )
minimize.addEventListener('click', () => windowControls.minimize() )

// Initialize wave
let waveform = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#bbb',
    progressColor: '#444',
    height: 50,
    cursorWidth: 0,
    barWidth: 2,
    barGap: 2,
    barRadius: 1,
    responsive: true
})

// Utilities
const formatTime = seconds => {
    let time = (seconds/60).toFixed(0).padStart(2, "0") + ":" + (seconds%60).toFixed(0).padStart(2, "0")
    if (seconds >= 3600) time = (seconds/3600).toFixed(0).padStart(2, "0") + ":" + time
    console.log(seconds, time)
}

// (async () => {
//     try {
//         const metadata = await mm.parseFile(path.join(__dirname,'../src/media/GOMD Video - J. Cole.mp3'))
//         console.log(util.inspect(metadata, { showHidden:false, depth:null }))

//         title.textContent = metadata.common.title
//         artist.textContent = metadata.common.artist
//         const picture = metadata.common.picture[0]
//         cover.style.background = `data:${picture.format};base64,${picture.data.toString('base64')}`;
//     } catch (error) {
//         console.error(error.message);
//     }
// })();

// temporarily used as is for filling in track info at launch (non-dynamic)
let trackList = [
    {
        title: "Sentinel",
        artist: "Kai Engel",
        cover: "D:/Mugtaba/dev/electron-quick-start/covers/a4124344313_10.jpg",
        path: "D:/Mugtaba/dev/electron-quick-start/media/Kai_Engel_-_04_-_Sentinel.mp3",
    },
    {
        title: "I Recall",
        artist: "Blue Dot Sessions",
        cover: "D:/Mugtaba/dev/electron-quick-start/covers/bluedotsessions-irecall.jpg",
        path: "D:/Mugtaba/dev/electron-quick-start/media/Blue_Dot_Sessions_-_I_Recall.mp3",
    }
]

const loadTrackDetails = () => {
	// resetValues()
	
    // duration = audio.duration
	// coverArt.crossOrigin = ''
	cover.src = trackList[trackIndex].cover
	title.textContent = trackList[trackIndex].title
	artist.textContent = trackList[trackIndex].artist
    // add conditions to load player (?)
}
const loadTrackDetailsFromFile = blob => {
    let details
    (async () => {
        try {
            details = await musicMetadata.getCommonMetadata(blob)
        } catch (error) {
            console.log('Something went wrong')
        }
    })();

    title.textContent = details.title
    artist.textContent = details.artist
    const picture = details.picture[0]
    cover.src = `data:${picture.format};base64,${picture.data.toString('base64')}`
}

// Load local files via drag & drop or open native file explorer
inputFile.onchange = (e) => {
    let file = inputFile.files[trackIndex]
    console.log(file)

    if (file) {
        let reader = new FileReader()

        reader.onload = e => {
            let blob = new window.Blob([new Uint8Array(e.target.result)])

            waveform.loadBlob(blob)
            console.log('blob loaded...')

            // get file metadata with music-metadata module
            // loadTrackDetailsFromFile( blob )
        }
        reader.readAsArrayBuffer(file)
        
        const dur = window.setInterval( () => {
            duration = waveform.getDuration()
            if (duration > 0) {
                document.querySelector('.duration').textContent = formatTime(duration)
                window.clearInterval(dur)
            }
        }, 1000)
        
    }
}

const playPause = () => {
    if (!waveform.isPlaying()) {
        // audio.play()
        waveform.play()
        if (waveform.isPlaying()) {
            cover.classList.add('playing')
            console.log('started playing...')
            playbutt.textContent = "Pause"
            let seeker = window.setInterval( () => updateSeekBar(), 1000 )
        }
    } else {
        // audio.pause()
        waveform.pause()
        if (!waveform.isPlaying()) {
            cover.classList.remove('playing')
            console.log('paused...')
            playbutt.textContent = "Play"
            // window.clearInterval( seeker )
        }
    }
};
// WIP - not very useful rn
const nextTrack = () => {
    if (trackIndex < trackList.length - 1) {
        trackIndex += 1
        loadTrack()
    }
    else {
        trackIndex = 0
        loadTrack()
    }
}
const updateSeekBar = () => {
    let time = waveform.getCurrentTime()
    seekBar.value = (time/duration) * 100
}

// Initialize some generic track info
loadTrackDetails()
audio.addEventListener('ended', () => {
    // maybe add check for playlist status here
    nextTrack()
})
playbutt.onclick = () => playPause()

// handle seek bar
seekBar.addEventListener('click', () => {
    waveform.setCurrentTime((duration/100) * seekBar.value)
})
// const updateSeekProgress = time => {
    // 
// }