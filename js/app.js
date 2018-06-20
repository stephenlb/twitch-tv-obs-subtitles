(e=>{'use strict';

setTimeout( e => candidate('cat'), 10 );
setTimeout( e => candidate('dog'), 1000 );
setTimeout( e => candidate('fox'), 2000 );
setTimeout( e => candidate('dogo'), 3100 );
setTimeout( e => candidate('doggo'), 3200 );
setTimeout( e => candidate('cat'), 3300 );
setTimeout( e => candidate('dogo'), 3400 );
setTimeout( e => candidate('kitty'), 3500 );
setTimeout( e => candidate('cat'), 3600 );
setTimeout( e => candidate('kitty'), 3650 );
setTimeout( e => candidate('cat'), 3680 );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// UI Elements
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
let hero = document.querySelector('#hero');
let used = {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function main() {
    // Listen for Words
    listen();

    // Continuous Listening
    spoken.listen.on.end(listen);
    spoken.listen.on.error(listen);

    // Search Giphy Image
    spoken.listen.on.partial(candidate);
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Word Search Candidate
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function candidate(speech) {
    const words = speech.split(' ');

    words.forEach( async ( word, position ) => {
        // Prevent Duplicate Capture
        const wordKey = `${word}-${position}`;
        if (wordKey in used) return;
        used[wordKey] = true;

        // Fetch Giphy Image
        const video = await giphy(word);

        // Display Giphy Image
        setHero(video.mp4);
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Update Hero Image
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function setHero(src) {
    const video = document.createElement('video');

    video.setAttribute( 'autoplay', 'autoplay' );
    video.setAttribute( 'loop', 'loop' );
    video.setAttribute( 'muted', 'muted' );
    video.setAttribute( 'playsinline', 'playsinline' );
    video.setAttribute( 'preload', 'auto' );

    video.onloadeddata = e => {
        const oldVideo = hero.querySelector('video');

        hero.querySelectorAll('video').forEach( oldVideo => {
            oldVideo.className = 'out';
            setTimeout( e => hero.childNodes.forEach( child => {
                if (child == oldVideo) hero.removeChild(oldVideo);
            } ), 400 );
        } );

        hero.appendChild(video);
    };

    video.src = src;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Fetch Image from Giphy API (using Functions)
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function giphy(search) {
    const subkey = 'sub-c-12780694-740e-11e8-af30-ee393ab85f0e';
    const url    = `https://ps.pubnub.com/v1/blocks/sub-key/${subkey}/giphy`;

    return new Promise( resolve => {
        const request = requester({ success : resolve });
        request({ url : `${url}?search=${search}` });
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Listen for Voice Commands
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function listen() {
    await delay(300);
    spoken.listen().then( speech => {
        candidate(speech);
        used = {};
    } ).catch( e => true );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Easy Wait Command
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function delay(duration) {
    return new Promise( resolve => setTimeout( resolve, duration ) );
}

main();

})()
