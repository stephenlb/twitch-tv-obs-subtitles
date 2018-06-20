let session = "";
let uri     = "http://api.giphy.com/v1/gifs/search";

export default ( request, response ) => {
    const pubnub = require('pubnub');
    const xhr    = require('xhr');
    const vault  = require('vault');
    const search = request.params.search || "";

    // TODO CaCHE Local
    return vault.get("giphy-key").then( apikey => {
        // TODO CaCHE KV
        // TODO CaCHE Local
        return xhr.fetch( `${uri}?` + [
            "q="       + search
        ,   "api_key=" + apikey
        ,   "limit="   + '5'
        ].join('&') ).then( giphy => {
            let video = null;

            try      { video = JSON.parse(giphy.body) }
            catch(e) { video = defaultVideo()         }

            const reply = videoURL(video);
            return response.send(reply);
            //pubnub.publish({ channel : "giphy" , message : reply });
        } );
    } );
};

function defaultVideo() {
    return { data : [ { images : { preview : { mp4 :
        "https://media2.giphy.com/media/JIX9t2j0ZTN9S/giphy-preview.mp4"
    } } } ] }
}

function videoURL(response) {
    let pos = Math.floor(Math.random()*response.data.length);
    if (response.data.length === 0) return videoURL(defaultVideo());
    return { mp4 : response.data[pos].images.preview.mp4 };
}
