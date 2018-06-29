(e=>{'use strict';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Settings
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const defaultSubkey = 'sub-c-12780694-740e-11e8-af30-ee393ab85f0e';
const subkey        = uripart('subkey')          || defaultSubkey;
const channel       = uripart('channel')         || uuid();
const enableGiphy   = uripart('giphy') == 'true' || false;
const rating        = uripart('rating');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Demo Test Mode
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
setTimeout( e => candidate('cat'), 10 );
setTimeout( e => candidate('dog'), 1000 );
setTimeout( e => candidate('fox'), 2000 );
setTimeout( e => candidate('dogo'), 1100 );
setTimeout( e => candidate('doggo'), 1200 );
setTimeout( e => candidate('cat'), 1300 );
setTimeout( e => candidate('dogo'), 1400 );
setTimeout( e => candidate('kitty'), 1500 );
setTimeout( e => candidate('cat'), 1600 );
setTimeout( e => candidate('kitty'), 1650 );
setTimeout( e => candidate('cat'), 1680 );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// UI Elements
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
let hero     = document.querySelector('#hero');
let subtitle = document.querySelector('#subtitle');
let used     = {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function main() {
    // Listen for OBS Updates
    startSubscribe( channel, video => {
        if (video.phrase in used) return;
        setHero(video.mp4);
        subtitle.innerHTML = video.phrase;
    } );

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
function candidate( speech, sentance=false ) {
    const words = sentance ? [speech] : speech.split(' ');

    words.forEach( async ( word, position ) => {
        // Prevent Duplicate Capture
        const wordKey = `${word}-${position}`;
        if (wordKey in used) return;
        used[wordKey] = true;

        // Subtitle Update
        subtitle.innerHTML = word;

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
    if (!src) return (hero.innerHTML = '');

    const video = document.createElement('video');

    video.setAttribute( 'autoplay',    'autoplay'    );
    video.setAttribute( 'loop',        'loop'        );
    video.setAttribute( 'muted',       'muted'       );
    video.setAttribute( 'playsinline', 'playsinline' );
    video.setAttribute( 'preload',     'auto'        );

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
    const url = `https://pubsub.pubnub.com/v1/blocks/sub-key/${subkey}/giphy`;

    return new Promise( resolve => {
        const request = requester({ success : resolve });
        const params  = [];

        if (search)  params.push(`search=${search}`);
        if (channel) params.push(`channel=${channel}`);
        if (rating)  params.push(`rating=${rating}`);

        params.push(`giphy=${enableGiphy}`);

        const uri = `${url}?` + params.join('&');

        request({ url : uri });
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Listen for Voice Commands
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function listen() {
    await delay(100);
    spoken.listen({continuous:false}).then( speech => {
        candidate( speech, sentance=true );
        used = {};
    } ).catch( e => true );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Easy Wait Command
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function delay(duration) {
    return new Promise( resolve => setTimeout( resolve, duration ) );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get URI Parameters
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function uripart(key) {
    const params = {};
    const href   = location.href;

    if (href.indexOf('?') < 0) return '';

    href.split('?')[1].split('&').forEach( m => {
        const kv = m.split('=');
        params[kv[0]] = kv[1];
    } );

    if (key in params) return params[key];

    return '';
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Subscribe for OBS Updates
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function startSubscribe( channelName, callback ) {
    subscribe({
        subkey  : subkey
    ,   channel : channelName
    ,   message : payload => {
            payload.m.forEach( message => callback(message.d) );
        }
    });
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// UUID
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function uuid() {
    let u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
        let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    return u;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Run Main Function
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
main();

})();
