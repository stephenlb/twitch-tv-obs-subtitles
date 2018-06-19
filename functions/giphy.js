let session = "";
let uri     = "http://api.giphy.com/v1/gifs/search";

export default ( request, response ) => {
    const pubnub = require('pubnub');
    const xhr    = require('xhr');
    const vault  = require('vault');

    let search = request.params.search || "";

    return vault.get("giphy-key").then( apikey => {
        return xhr.fetch( `${uri}?` + [
            "q="       + search
        ,   "api_key=" + apikey
        ,   "limit="   + '5'
        ].join('&') ).then( result => {
            let images = null;

            try      { images = JSON.parse(result.body) }
            catch(e) { images = defaultImgs()               }

            const reply = imageURLs(images);

            pubnub.publish({ channel : "giphy" , message : reply });

            return response.send(reply);
        } );
    } );
};

function defaultImgs() {
    return { data : [ { images : {
        downsized        : { url : "https://media2.giphy.com/media/JIX9t2j0ZTN9S/giphy-downsized.gif" }
    ,   downsized_medium : { url : "https://media2.giphy.com/media/JIX9t2j0ZTN9S/giphy-downsized-medium.gif" }
    }}]}
}

function imageURLs(response) {
    let pos = Math.floor(Math.random()*response.data.length);
    if (response.data.length === 0) return imageURLs(defaultImgs());
    return {
        small : response.data[pos].images.downsized
    ,   large : response.data[pos].images.downsized_medium
    }
}
