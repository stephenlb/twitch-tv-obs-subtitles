(e=>{'use strict';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Settings
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const defaultSubkey   = 'sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14';
const defaultPubkey   = 'pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe';
const defaultChannel  = uuid();
const defaultMaxWords = 250;
const defaultStyle    = '';
const clearTime       = +uripart('cleartime') || 4; // Seconds
const introText       = uripart('introtext')  || 'Start talking.';
const continuous      = uripart('continuous') || 'on';
const mic             = uripart('mic')        || 'on';
const language        = uripart('language')   || uripart('lang') || null;
const subkey          = uripart('subkey')     || defaultSubkey;
const pubkey          = uripart('pubkey')     || defaultPubkey;
const channel         = uripart('channel')    || username() || askchannel() || defaultChannel;
const maxWords        = uripart('maxwords')   || defaultMaxWords;
let   subtitleStyle   = uripart('style')      || defaultStyle;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Ask for Channel
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function askchannel() {
    let instructions                                                     = 
        "Missing configuration!<br>"                                     +
        "<a href='https://github.com/stephenlb/twitch-tv-obs-subtitles/" + 
        "blob/master/readme.md#running-twitchtv-subtitles-from-local-"   +
        "files-on-your-hard-drive'>Follow Instructions</a>";
    setTimeout( e => candidate(instructions), 1000 );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Introduction Text
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
setTimeout( e => candidate(introText), 10 );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// UI Elements
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
let subtitles = document.querySelector('#subtitle');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function main() {
    // Listen for OBS Updates
    startSubscribe( channel, speech => updateSubtitles(speech) );

    // Set Styles of Subtiltle Text
    updateSubtitleStyle(subtitleStyle);

    // Set Language
    if (language) spoken.recognition.lang = language;

    // Listen to Microphone
    if (mic == 'off') return;

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
    publish( channel, {
        phrase : updateSubtitles({ phrase: speech })
    ,   style  : subtitleStyle
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Update Subtitles Style
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function updateSubtitleStyle(style) {
    subtitles.style = style;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Update Subtitles
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function updateSubtitles(speech) {
    if (speech && speech['style']) subtitleStyle = speech['style'];
    updateSubtitleStyle(subtitleStyle);
    speech.style = subtitleStyle;
    subtitles.innerHTML = getMaxWords(speech.phrase);

    // Clear Text after moments of silence.
    clearTimeout(updateSubtitles.ival);
    updateSubtitles.ival = setTimeout( async ival => {
            subtitles.innerHTML = ' ';
            spoken.listen.stop();
            listen();
    }, (+clearTime) * 1000 );

    return subtitles.innerHTML;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Ensure only maxWords are displayed on the screen
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function getMaxWords(speech) {
    let words = speech.split(' ');
    return words.slice(-maxWords).join(' ');
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Listen for Voice Commands
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function listen() {
    await delay(200);
    spoken.listen({continuous:continuous=='on'}).then( speech => {
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

    if (key in params) return decodeURIComponent(params[key]);

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
