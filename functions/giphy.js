// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Imports
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const pubnub = require('pubnub');
const xhr    = require('xhr');
const vault  = require('vault');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export default ( request, response ) => {
    const search  = request.params.search          || 'cat';
    const rating  = request.params.rating          || 'pg'; // y,g,pg,pg-13,r
    const channel = request.params.channel         || false;
    const giphy   = request.params.giphy == 'true' || false;

    // Ignore if Giphy not Enabled
    if (!giphy) {
        const reply = { phrase : search };
        if (channel) pubnub.publish({ channel : channel , message : reply });
        return response.send(reply);
    }

    // Get Giphy Result (cached)
    return giphySearch( search, rating ).then( giphyResponse => {
        let video = null;

        try      { video = JSON.parse(giphyResponse.body) }
        catch(e) { video = defaultVideo()         }

        const reply = videoURL(video);
        reply.phrase = search;
        if (channel) pubnub.publish({ channel : channel , message : reply });
        return response.send(reply);
    } );
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Giphy Search (cached)
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const giphyURI   = 'http://api.giphy.com/v1/gifs/search';
const giphyCache = {};

function giphySearch( search='cat', rating='pg' ) {
    return new Promise( resolve => {
        // Fetch Vault Key ( will reutrn local cache )
        return getVaultKey('giphy-key').then( apikey => {
            // Fetch URI and Cache Key
            const fetchKey = `${giphyURI}?` + [
                'q='       + search
            ,   'api_key=' + apikey
            ,   'rating='  + rating
            ,   'lang='    + 'en'
            ,   'limit='   + '10'
            ].join('&');

            // Return local Giphy result if cached
            if (fetchKey in giphyCache) return resolve(giphyCache[fetchKey]);

            // We don't have cached result so we can search
            // and then save to cache
            return xhr.fetch(fetchKey).then( giphyResponse => {
                // Save Local Cache
                giphyCache[fetchKey] = giphyResponse;
                // Return newly fetched Giphy Response
                return resolve(giphyResponse);
            } );
        } );
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get Vaulted API Key and Cache Local Result
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
let giphyAPIKey = '';
function getVaultKey(fetchKey) {
    return new Promise( resolve => {
        if (giphyAPIKey) return resolve(giphyAPIKey);
        return vault.get(fetchKey).then( apikey => {
            giphyAPIKey = apikey;
            resolve(apikey);
        } );
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Default Giphy Response on Empty Responses
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function defaultVideo() {
    return { data : [ { images : { preview : { mp4 :
        'https://media2.giphy.com/media/JIX9t2j0ZTN9S/giphy-preview.mp4'
    } } } ] }
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Filter Giphy Response for randomized MP4
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function videoURL(response) {
    if (!('data' in response) || response.data.length === 0)
	return videoURL(defaultVideo());
    let pos = Math.floor(Math.random()*response.data.length);
    return { mp4 : response.data[pos].images.preview.mp4 };
}
