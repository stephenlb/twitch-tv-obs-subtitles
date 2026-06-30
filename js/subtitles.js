(e=>{'use strict';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Settings
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const defaultSubkey   = 'sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14';
const defaultPubkey   = 'pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe';
const defaultChannel  = uuid();
const defaultMaxWords = 250;
const defaultStyle    = '';
const clearTime       = +uripart('cleartime')  || 4; // Seconds
const reloadTime      = +uripart('reloadtime') || 20; // Minutes
const introText       = uripart('introtext')   || 'Start talking.';
const continuous      = uripart('continuous')  || 'on';
const mic             = uripart('mic')         || 'on';
const language        = uripart('language')    || uripart('lang') || null;
const subkey          = uripart('subkey')      || defaultSubkey;
const pubkey          = uripart('pubkey')      || defaultPubkey;
const channel         = uripart('channel')     || username() || askchannel() || defaultChannel;
const maxWords        = uripart('maxwords')    || defaultMaxWords;
const origin          = uripart('origin')      || null;
let   subtitleStyle   = uripart('style')       || defaultStyle;

// Profanity Filter Word List
const profanityList = [
    'ass', 'asshole', 'bastard', 'bitch', 'bollocks',
    'bullshit', 'cock', 'crap', 'cunt', 'damn', 'dammit',
    'dick', 'douche', 'douchebag', 'fag', 'faggot', 'god',
    'fuck', 'fucking', 'fucked', 'fucker', 'goddamn', 'goddammit',
    'hell', 'horseshit', 'jackass', 'motherfucker', 'motherfucking',
    'nigger', 'nigga', 'piss', 'prick', 'pussy',
    'shit', 'shitty', 'slut', 'twat', 'whore',
    'wanker', 'wtf', 'stfu', 'fu'
];
const profanityRegex = new RegExp(
    '\\b(' + profanityList.join('|') + ')\\b', 'gi'
);

// Word Substitution Dictionary - add new "from": "to" pairs here
const substitutions = {
    'Steven' : 'Stephen',
};
// Case-insensitive lookup so matches resolve regardless of input casing
const substitutionLookup = Object.fromEntries(
    Object.entries(substitutions).map(([k, v]) => [k.toLowerCase(), v])
);
// Compiled once, reused on every update
const substitutionRegex = new RegExp(
    '\\b(' + Object.keys(substitutions).join('|') + ')\\b', 'gi'
);

// Setup PubNub
const pubnub = PubNub({
    subscribeKey: subkey,
    publishKey: pubkey,
    origin: origin,
});

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

    // Auto-reload page after configured time
    if (reloadTime > 0) {
        setTimeout(() => {
            location.reload();
        }, reloadTime * 60 * 1000);
    }
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Word Search Candidate
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function candidate(speech) {
    publish( channel, {
        phrase : updateSubtitles({ phrase: speech })
    ,   style  : subtitleStyle
    } );
    if (speech.includes('?')) {
        location.reload();
        return;
    }
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
    subtitles.innerHTML = getMaxWords(filterProfanity(filterNames(speech.phrase)));

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
    let words = speech.split(' ').filter( w => w );
    return words.slice(-maxWords).join(' ');
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Profanity Filter - Replace bad words with "puppies"
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function filterProfanity(text) {
    return text.replace(profanityRegex, 'puppies');
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Word Filter - Replace words using the substitutions dictionary
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function filterNames(text) {
    return text.replace(substitutionRegex, match =>
        substitutionLookup[match.toLowerCase()]
    );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Listen for Voice Commands
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function listen() {
    await delay(20);
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
    const subscription = pubnub.subscribe({
        channel: channelName,
        messages: callback
    });
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Publish Captured Subtitles
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function publish( channelName, data={} ) {
    return pubnub.publish({
        channel: channelName,
        message: data
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
