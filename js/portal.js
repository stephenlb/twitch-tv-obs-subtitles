(e=>{'use strict';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Portal JS API
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const portal = window.portal = () => {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get User Data
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
portal.getUser = e => api('/api/me');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get Account Details
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
portal.getAccount = user => {
    return new Promise( async resolve => {
        const result = await api( '/api/accounts', {user_id : user.user_id} );
        if (result.accounts.length) return resolve(result.accounts[0]);
        return resolve(null);
    } );
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get Apps and API Keys
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
portal.getApps = account => api( '/api/apps', { owner_id : account.id } );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Find an App and get API Keys
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
portal.findApp = ( account, name='Twitch TV Subtitles' ) => {
    return new Promise( async resolve => {
        const apps = await portal.getApps(account);
        const app  = apps.filter( app => app.name == name );
        if (app.length) return resolve(app[0]);
        return resolve(null);
    } );
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Create App
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
portal.createApp = ( account, name='MyApp' ) => api( '/api/apps', {}, 'POST',{
    name       : name
,   owner_id   : account.id
,   properties : {}
} );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Automagically Get API Keys or Create New App
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
portal.autoApp = (name='Twitch TV Subtitles') => {
    let user    = null;
    let account = null;
    let app     = null;
    let keys    = null;

    return new Promise( async resolve => {
        // Get the User Account Data
        while (!user) {
            user = await portal.getUser();
            if (!user) await delay(3000);
        }

        // Get Account ID
        account = await portal.getAccount(user);

        // Get Apps and the API Keys
        app = await portal.findApp( account, name );

        // Create App if it doesn't exist
        if (!app) {
            await portal.createApp( account, name );
            app = await portal.findApp( account, name );
        }

        // Get Keys from App
        keys = app.keys[0];

        // Return Results we got it all
        return resolve({
            keys    : keys
        ,   user    : user
        ,   account : account
        ,   app     : app
        });

    } );
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Portal API Call
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function api( path='/api/me', params={}, method='GET', body=null ) {
    const domain  = 'https://admin.pubnub.com';
    const token   = cookie('PN-1-pnAdminToken');
    const headers = {};

    if (method == 'POST') {
        headers['content-type']    = 'application/json;charset=UTF-8';
        headers['x-session-token'] = token;
    }
    else params.token = token;

    return new Promise( resolve => {
        if (!token) return resolve(null);
        requester({
            success : data => resolve(data && data.result || null)
        ,   fail    : data => resolve(null)
        })({
            url     : `${domain}${path}`
        ,   headers : headers
        ,   params  : params
        ,   method  : method
        ,   payload : body
        });
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get Cookie Data
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function cookie(name) {
    const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)')
    );
    if (match) return match[2];
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Easy Wait Command
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function delay(duration) {
    return new Promise( resolve => setTimeout( resolve, duration ) );
}

})();
