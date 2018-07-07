(e=>{'use strict';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function main() {
    let user = null;
    let keys = null;

    // Get the User Account Data
    while (!user) {
        user = await account();
        if (!user) await delay(2000);
    }

    // Get the API Key Data
    while (!keys) {
        keys = await apikeys(user);
        if (!keys) await delay(2000);
    }

    // Detect Twitch APP ( if not exist then create )
    // Update OBS Browser Source URL and Live Capture iFrame
    //document.querySelector('#obs-url').src = '';
    //document.querySelector('#subtitle-display').value = '';

    console.log(user, keys);
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get Account Data
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function account() {
    const domain = 'https://admin.pubnub.com';
    const token  = cookie('PN-1-pnAdminToken');
    const url    = `${domain}/api/me?token=${token}`;
    return new Promise( resolve => {
        if (!token) return resolve(null);
        requester({
            success : data => resolve(data && data.result || null)
        ,   fail    : data => resolve(null)
        })({ url : url });
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get API Keys
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function apikeys(user) {
    const id     = user.user_id;
    const token  = cookie('PN-1-pnAdminToken');
    const domain = 'https://admin.pubnub.com';
    const url    = `${domain}/api/apps?owner_id=${id}&token=${token}`;
    return new Promise( resolve => {
        requester({
            success : data => resolve(data && data.result || null)
        ,   fail    : data => resolve(null)
        })({ url : url });
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

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Run Main
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
main();

})();
