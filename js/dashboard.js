(e=>{'use strict';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function main() {

    // UI Elements
    const captureFrame = document.querySelector('#subtitle-display');
    const obsLink      = document.querySelector('#obs-url');
    const heroHeader   = document.querySelector('#header');
    const instructions = document.querySelector('#instructions');

    // Subtitles Application Page
    const obsDomain = 'https://stephenlb.github.io';
    const obsPath   = '/twitch-tv-obs-subtitles';

    // Detect if speech transcription is available
    const available = speechAvailable();

    // Set Frame Warning if Speech Unavailable
    if (!available) {
        captureFrame.src = `${obsDomain}${obsPath}/unavailable.html`;
        instructions.className = 'no-installation-guide';
        return;
    }

    // Setup Persisted Unique Channel
    let channel    = cookie('TwitchOBSChannel');
    let rndchannel = ''+ +new Date + ''+ Math.floor(Math.random()*1000000000);
    if (!channel) channel = cookie( 'TwitchOBSChannel', rndchannel );

    // Set API Keys
    const obsVars = {
        subkey  : 'sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14'
    ,   pubkey  : 'pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe'
    ,   channel : channel
    };

    const obsParams = Object.keys(obsVars).map(
        k => `${k}=${obsVars[k]}`
    ).join('&');

    const obsSource = `${obsDomain}${obsPath}/subtitles.html?${obsParams}`;

    // Hide Shooting Stars for OBS Performance
    heroHeader.className = 'no-stars';

    // Update OBS Browser Source URL and Live Capture Frame
    captureFrame.src = obsSource;
    obsLink.value    = obsSource;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Speech Transcription Available
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function speechAvailable() {
    const recognition = new (
        window.SpeechRecognition       ||
        window.webkitSpeechRecognition ||
        Object
    )();
    return !!recognition.start;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Easy Wait Command
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function delay(duration) {
    return new Promise( resolve => setTimeout( resolve, duration ) );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get/Set Cookie Data
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function cookie( name, value ) {
    if (value) document.cookie = `${name}=${value}`;
    const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)')
    );
    if (match) return match[2];
}


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Run Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
main();

})();
