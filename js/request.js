(function(){

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Request URL
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var requester = window.requester = function(setup={}) {

    var xhr      = new XMLHttpRequest()
    ,   finished = false
    ,   timeout  = setup.timeout || 15000
    ,   success  = setup.success || function(){}
    ,   fail     = setup.fail    || function(){};

    // Cancel a Pending Request
    function abort() {
        if (finished) return;
        xhr.abort && xhr.abort();
        finish();
    }

    // Mark Request as Completed
    function finish() {
        finished = true;
        clearTimeout(xhr.timer);
    }

    // When a Request has a Payload
    xhr.onload = function() {
        if (finished) return;
        finish();
        var result;

        try      { result = JSON.parse(xhr.response) }
        catch(e) { fail(xhr) }

        if (result) success(result);
        else        fail(xhr);
        result = null;
    };

    // When a Request has Failed
    xhr.onabort = xhr.ontimeout = xhr.onerror = function() {
        if (finished) return;
        finish();
        fail(xhr);
    };

    // Return Requester Object
    return function(setup) {
        var url     = setup.url     || 'https://ps.pubnub.com/time/0'
        ,   headers = setup.headers || {}
        ,   method  = setup.method  || 'GET'
        ,   payload = setup.payload || null
        ,   params  = setup.params  || setup.data || {}
        ,   data    = [];

        // URL Parameters
        for (var param in params)
            data.push([ param, params[param] ].join('='));

        // Start Request
        finished = false;
        xhr.timeout = timeout;
        xhr.open(
            method,
            url + (data.length ? ('?' + data.join('&')) : ''),
            true
        );

        // Headers
        for (var header in headers)
            xhr.setRequestHeader( header, headers[header] );

        // Send Request
        xhr.send(payload);

        // Timeout and Aboart for Slow Requests
        xhr.timer && clearTimeout(xhr.timer);
        xhr.timer = setTimeout( function(){
            if (finished) return;
            abort();
            fail(xhr);
        }, timeout );

        return {
            xhr   : xhr,
            abort : abort
        } 
    };
};


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Subscribe
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var subscribe = window.subscribe = function(setup) {
    var pubkey    = setup.pubkey    || 'demo'
    ,   subkey    = setup.subkey    || 'demo'
    ,   channel   = setup.channel   || 'a'
    ,   timeout   = setup.timeout   || 290000
    ,   timetoken = setup.timetoken || '0'
    ,   message   = setup.message   || function(){}
    ,   windy     = setup.windowing || 1000
    ,   windowing = 10
    ,   stop      = false
    ,   url       = ''
    ,   origin    = 'ps'+(Math.random()+'').split('.')[1]+'.pubnub.com';

    // Requester Object
    var request = requester({
        timeout : timeout,
        success : next,
        fail    : function(){ next() }
    });

    // Subscribe Loop
    function next(payload) { 
        if (stop) return;
        if (payload) {
            timetoken = payload.t.t;
            message(payload);
        }

        url = [
            'https://',       origin, 
            '/v2/subscribe/', subkey,
            '/',              channel,
            '/0/',            timetoken
        ].join('');

        setTimeout( function() {
            windowing = windy;
            request({ url : url });
        }, windowing );
    }

    // Cancel Subscription
    function unsubscribe() {
        stop = true;
    }

    // Start Subscribe Loop
    next();

    // Allow Cancelling Subscriptions
    return {
        unsubscribe : unsubscribe
    };
};

})();
