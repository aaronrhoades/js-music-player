var musicPlayer = document.getElementById("musicPlayer");

var audioCtx;
var source;
var playlist = [
    {
        fileLocation: "./assets/audio/TheHaunting.mp3",
        title: "First Song"  
    },
    {
        fileLocation: "./assets/audio/TheHaunting2.mp3",
        title: "Second Song"  
    },
    {
        fileLocation: "../assets/audio/test-1.mp3",
        title: "Third Song"  
    }
];
var playlistIndex = 0;
var progBar = document.getElementById('progBar');
var pre = document.querySelector('pre');
var myScript = document.querySelector('script');
var play = document.querySelector('.play');
var stopBtn = document.querySelector('.stop');
var playPauseBtn = document.querySelector('.playPause');
var prevBtn = document.querySelector('.prev');
var nextBtn = document.querySelector('.next');
var songTitle = document.querySelector('.title');
var isPlaying = false;
  
/*=================================

    Music Player Controls    

================================= */

stopBtn.onclick = function() {
    source.stop(0);
    closeAudioContext();
    setPlayPauseIcon("play");
    isPlaying = false;
    updateUI();

    window.clearInterval(timerFunctions);
}

playPauseBtn.onclick = function() {
    if(!audioCtx || audioCtx.state === 'closed'){
        getAndPlayAudio();
        setPlayPauseIcon('pause');
        isPlaying = true;
        return;
    }
    if(audioCtx.state === 'running') {
    audioCtx.suspend().then(function() {
        window.clearInterval(timerFunctions);
        setPlayPauseIcon('play');
        isPlaying = false;
    });
    } else if(audioCtx.state === 'suspended') {
    audioCtx.resume().then(function() {
        window.setInterval(timerFunctions, 100);
        setPlayPauseIcon('pause');
        isPlaying = true;
    });  
    }
}

prevBtn.onclick = function() {
    if (audioCtx.state === 'running' || audioCtx.state === 'suspended')
        source.stop(0);

    if (audioCtx != 'closed')
        closeAudioContext();
        
    if (audioCtx.currentTime < 3 || !isPlaying) {
        decrementIndex();
    }
    if (isPlaying) {
        getAndPlayAudio();
    }
    updateUI();
} 
nextBtn.onclick = function() {
    if (isPlaying) {
        playNextSong();
    } else {
        incrementIndex();
        audioCtx.close();
    }
    updateUI();
}

//======================================================
// use XHR to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source

function getAudioData(fileLocation) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.onstatechange = (e) => {
        console.log(e);
        updateLogging();   
    }
    source = audioCtx.createBufferSource();
    var request = new XMLHttpRequest();
    request.open('GET', fileLocation, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      var audioData = request.response;
  
      audioCtx.decodeAudioData(
        audioData,
        buffer => {
          source.buffer = buffer;
          source.connect(audioCtx.destination);
          source.loop = false;
          source.addEventListener('ended',() => {
              playNextSong();
          });
        },
        e => {
             console.log("Error with decoding audio data" + e.err);
        }
    );
  
    }
    request.send();
} //end getAudioData()

function closeAudioContext() {
    audioCtx.close().then(function() { 
      console.log("close function of Audio Context");
    });
}

function getAndPlayAudio() {
    window.setInterval(timerFunctions, 100);
    getAudioData(playlist[playlistIndex].fileLocation);
    source.start(0);
    updateUI();
}

function updateUI() {
    songTitle.innerHTML = playlist[playlistIndex].title;
}

var updater = document.getElementById('updater');
function toggleDiagnostics() {
    let btnToggle = document.getElementById("btnToggleDiagnostics");
    if (updater.getAttribute('hidden') === 'hidden') {
        updater.removeAttribute("hidden");
        btnToggle.innerText = 'Hide Diagnostics'; 
    } else { 
        updater.setAttribute("hidden", "hidden");
        btnToggle.innerText = 'Show Diagnostics';
    }     
}
function updateLogging() {
    if (audioCtx) {
        var timestamp = audioCtx.getOutputTimestamp();        
        var txt = "Current Time: " + audioCtx.currentTime + "<br>";
        txt += "Current State: " + audioCtx.state + "<br>";
        txt += "Timestamp Current Time: " + timestamp['currentTime'] + "<br>";
        txt += "Timestamp Performance Time: " + timestamp['performanceTime'] + "<br>";
        txt += "Buffer: " + this.source.buffer + "<br>"; 
        txt += "isPlaying: " + isPlaying;
        updater.innerHTML = txt;
    }
}

function timerFunctions() {
    //update progress bar
    if (audioCtx && audioCtx.state != 'closed' && this.source.buffer) {
        let progBarValue = 100 * (this.audioCtx.currentTime / this.source.buffer['duration']) || 0;
        progBar.value = progBarValue;
        
    } else {
        progBar.value = 0;
    }
    updateLogging();
}
function setPlayPauseIcon(iconName) {
    if(iconName === 'play'){
        playPauseBtn.getElementsByClassName("playIcon")[0].style.display = "initial";
        playPauseBtn.getElementsByClassName("pauseIcon")[0].style.display = "none";
        playPauseBtn.setAttribute("aria-label", "Play music");
    } else {
        playPauseBtn.getElementsByClassName("pauseIcon")[0].style.display = "initial";
        playPauseBtn.getElementsByClassName("playIcon")[0].style.display = "none";
        playPauseBtn.setAttribute("aria-label", "Pause music");
    }
}

function playNextSong() {
    incrementIndex();
    if (isPlaying) source.stop(0);
    if(audioCtx.state != 'closed') {
        audioCtx.close().then(() => {
            getAudioData(playlist[playlistIndex].fileLocation);
            if(isPlaying) {
                source.start(0);
            }
            updateUI();     
        });
    } else{
        getAudioData(playlist[playlistIndex].fileLocation);
        if(isPlaying) {
            source.start(0);
        }
        updateUI();
    }
}
function decrementIndex() {
    if (playlistIndex <= 0) {
        playlistIndex = playlist.length - 1;
    } else {
        playlistIndex--;
    }
}
function incrementIndex() {
    if ((playlistIndex + 1 >= playlist.length))
        playlistIndex = 0;
    else 
        playlistIndex++;
}