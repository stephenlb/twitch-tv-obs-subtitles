// ---------------------------------------------
// SSE over HTTP/3 with IPv4+IPv6 PubNub Client
// ---------------------------------------------
// - - - - - - - - - - - - - - - - - - - - - - -
// Features
// - - - - - - - - - - - - - - - - - - - - - - -
//  - Publish/Subscribe
//  - SSE
//  - Streamming Compression
//  - Dedicated queue per channel for maximum performance
//  - SSE over HTTP/3 with IPv4+IPv6
//  - IPv6, IPv4
//  - HTTP/3, HTTP/2, and HTTP/1.1 fallback
//  - TLS 1.3

(async ()=>{ 

// PubNub Client
function PubNub(setup) {
    for (let key of Object.keys(setup)) PubNub[key] = setup[key];
    return PubNub;
}

const defaultSubkey  = 'demo';
const defaultPubkey  = 'demo';
const defaultChannel = 'pubnub';
const defaultUserId  = 'user-default';
const defaultAuthKey = 'user-default';
const defaultOrigin  = 'h2.pubnubapi.com';

const subscribe = PubNub.subscribe = (setup={}) => {
    let subkey     = setup.subscribeKey || PubNub.subscribeKey || defaultSubkey;
    let channel    = setup.channel      || PubNub.channel      || defaultChannel;
    let origin     = setup.origin       || PubNub.origin       || defaultOrigin;
    let uuid       = setup.userId       || PubNub.userId       || defaultUserId;
    let authkey    = setup.authKey      || PubNub.authKey      || defaultAuthKey;
    let messages   = setup.messages     || PubNub.messages     || (a => a);
    let filter     = setup.filter       || PubNub.filter       || '';
    let timetoken  = setup.timetoken    || '10000';
    let filterExp  = `${filter?'&filter-expr=':''}${encodeURIComponent(filter)}`;
    let params     = `auth=${authkey}${filterExp}&uuid=${uuid}`;
    let decoder    = new TextDecoder();
    let boundry    = /[\n]/g;
    let resolver   = null;
    let promissory = () => new Promise(resolve => resolver = (data) => resolve(data) ); 
    let receiver   = promissory();
    let reader     = null;
    let response   = null;
    let buffer     = '';
    let subscribed = true;
    let controller = new AbortController();
    let signal     = controller.signal;

    // Start Stream
    startStream();

    async function startStream() {
        let uri = `https://${origin}/stream/${subkey}/${channel}/0/${timetoken}`;
        buffer  = '';

        try      { response = await fetch(`${uri}?${params}`, {signal}) }
        catch(e) { return continueStream(1000)                          }

        try      { reader = response.body.getReader()                   }
        catch(e) { return continueStream(1000)                          }

        try      { readStream()                                         }
        catch(e) { return continueStream(1000)                          }
    }

    function continueStream(delay) {
        if (!subscribed) return;
        setTimeout( () => startStream(), delay || 1 );
    }

    async function readStream() {
        let chunk   = await reader.read().catch(error => {
            continueStream();
        });
        if (!chunk) return;

        buffer   += decoder.decode(chunk.value || new Uint8Array);
        let parts = buffer.split(boundry);

        parts.forEach( (message, num) => {
            if (!message) return;
            try {
                let jsonmsg = JSON.parse(message);
                if (jsonmsg[1]) setup.timetoken = timetoken = jsonmsg[1];

                // Send message to receivers/callbacks
                jsonmsg[0].forEach(m => {
                    messages(m);
                    resolver(m);
                    receiver = promissory();
                });

                // Free successfully consumed message
                parts[num] = '';
                buffer = parts.filter(p => p).join('\n');
            }
            catch(e) {
                // wait for next chunck to construct full JSON.
            }
        });

        if (!chunk.done) readStream();
        else             continueStream();
    }

    // Subscription Structure
    async function* subscription() {
        while (subscribed) yield await receiver;
    }

    const iterator = subscription();
    iterator.messages    = receiver => messages = setup.messages = receiver;
    iterator.unsubscribe = () => {
        subscribed = false;
        controller.abort();
    };

    // Return Async Generator Iterator
    return iterator;
};

const publish = PubNub.publish = async (setup={}) => {
    let pubkey    = setup.publishKey   || PubNub.publishKey   || defaultPubkey;
    let subkey    = setup.subscribeKey || PubNub.subscribeKey || defaultSubkey;
    let channel   = setup.channel      || PubNub.channel      || defaultChannel;
    let userId    = setup.userId       || PubNub.userId       || defaultUserId;
    let authkey   = setup.authKey      || PubNub.authKey      || defaultAuthKey;
    let origin    = setup.origin       || PubNub.origin       || defaultOrigin;
    let uuid      = setup.userId       || PubNub.userId       || defaultUserId;
    let message   = setup.message      || 'missing-message';
    let metadata  = setup.metadata     || PubNub.metadata     || {};
    let uri       = `https://${origin}/publish/${pubkey}/${subkey}/0/${channel}/0`;
    let params    = `auth=${authkey}&meta=${encodeURIComponent(JSON.stringify(metadata))}&uuid=${uuid}`;
    let payload   = { method: 'POST', body: JSON.stringify(message) };

    try      { return await fetch(`${uri}?${params}`, payload) }
    catch(e) { return false }
};

// Conditionally export pubnub.js for Node.js and Browser
if (typeof module !== 'undefined') module.exports = PubNub;
if (typeof window !== 'undefined') window.PubNub = PubNub;

})();