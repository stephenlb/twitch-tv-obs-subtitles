(e=>{'use strict';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Settings
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const defaultPubkey   = 'pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe';
const defaultSubkey   = 'sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14';
const defaultChannel  = uuid();
const defaultMaxWords = 25;
const pubkey          = uripart('pubkey')          || defaultPubkey;
const subkey          = uripart('subkey')          || defaultSubkey;
const channel         = uripart('channel')         || defaultChannel;
const maxWords        = uripart('maxwords')        || defaultMaxWords;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Introduction Text
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
setTimeout( e => candidate('Start talking.'), 10 );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// UI Elements
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
let subtitles = document.querySelector('#subtitle');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function main() {
    // Listen for OBS Updates
    startSubscribe( channel, speech => {
        updateSubtitles(speech.phrase);
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
function candidate(speech) {
    publish( channel, { phrase : updateSubtitles(speech) } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Update Subtitles
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function updateSubtitles(speech) {
    let words = speech.split(' ');
    subtitles.innerHTML = words.slice(-maxWords).join(' ');
    return subtitles.innerHTML;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Listen for Voice Commands
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function listen() {
    await delay(300);
    spoken.listen({continuous:false}).then( speech => {
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
// Publish Captured Subtitles
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const origin = 'ps'+(Math.random()+'').split('.')[1]+'.pubnub.com';
function publish( channelName, data={} ) {
    return requester({ timeout : 10000 })({ url : [
        'https://',  origin,
        '/publish/', pubkey,
        '/',         subkey,
        '/0/',       channelName,
        '/0/',       encodeURIComponent(JSON.stringify(data))
    ].join('') });
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
