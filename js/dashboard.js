(function(){'use strict';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function main() {

    // UI Elements
    const captureFrame = document.querySelector('#subtitle-display');
    const obsLink      = document.querySelector('#obs-url');
    const heroHeader   = document.querySelector('#header');
    const instructions = document.querySelector('#instructions');
    const styler       = document.querySelector('#subtitle-styles');

    // Subtitles Application Page
    const obsDomain = 'https://stephenlb.github.io';
    const obsPath   = '/twitch-tv-obs-subtitles';
    //const obsDomain = 'https://0.0.0.0:4443';
    //const obsPath   = '/';

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
    let styling    = cookie('TwitchOBSStyling') || '';
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

    // OBS Source Link Gennerator
    function generateOBSSourceURL(style) {
        let es = encodeURIComponent(style);
        return `${obsDomain}${obsPath}/subtitles.html?${obsParams}&style=${es}`
    }

    // Generate First OBS URL ( future urls generated on sytle update )
    const obsSource = generateOBSSourceURL(cookie('TwitchOBSStyling')||'');

    // Hide Shooting Stars for OBS Performance after 30 seconds
    setTimeout( a => heroHeader.className = 'no-stars', 30 * 1000 );

    // Update OBS Browser Source URL and Live Capture Frame
    captureFrame.src = obsSource;
    obsLink.value    = obsSource;

    // Set Bind on Style Selector
    styler.addEventListener( 'click', (e) => {
        let style        = e.target.getAttribute('style');
        let url          = generateOBSSourceURL(style);

        if (!style) return;

        // Save Selected Stylek
        cookie( 'TwitchOBSStyling', style );

        // Update Preview Display
        captureFrame.src = url;
        obsLink.value    = url;
    } );
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
    if (value) localStorage.setItem( name, JSON.stringify(value) );
    return JSON.parse(localStorage.getItem(name));
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Run Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
main();

})();
