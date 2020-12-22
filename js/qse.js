// Populate these confiugration parameters with your tenant details
var tenantConfig = {
    uri: 'https://mcalees-cs.us.qlikcloud.com',
    webIntegrationId: 'R7r1YNhugj5PhEwhSxtfxfcF5_jghYRe'
};

// This helper function takes a Qlik Sense SaaS API path and returns
// a Json result by default or optionally a result code
async function qseRequest(path, returnJson = true) {
    const res = await fetch(`${tenantConfig.uri}${path}`, {
        mode: 'cors',
        credentials: 'include',
        redirect: 'follow',
        headers: {
            // web integration is sent as a header:
            'qlik-web-integration-id': tenantConfig.webIntegrationId
        },
    });
    if (res.status < 200 || res.status >= 400) throw res;
    return returnJson ? res.json() : res;
}

// If user is currently logged into SaaS tenant, this function
// will return the user's name, otherwise null.
async function qseGetUser() {
    try {
        // Call your tenant API /api/v1/users/me to retrieve
        // the user metadata, as a way to detect if they are
        // signed in. An error will be thrown if the response
        // is a non-2XX HTTP status:
        const user = await qseRequest('/api/v1/users/me');
        return user.name;
    } catch (err) {
        throw err;
    }
}

// Login into your tenant URI and return the user's name.  If the 
// user is already logged in, the user's name will be returned.
async function qseLogin() {
    try {
        // Call your tenant API /api/v1/users/me to retrieve
        // the user metadata, as a way to detect if they are
        // signed in. An error will be thrown if the response
        // is a non-2XX HTTP status:
        const user = await qseRequest('/api/v1/users/me');
        return user.name;
    } catch (err) {
        const returnTo = encodeURIComponent(window.location.href);
        // redirect your user to the tenant log in screen, and once they're
        // signed in, return to your web app:
        window.location.href = `${tenantConfig.uri}/login?returnto=${returnTo}&qlik-web-integration-id=${tenantConfig.webIntegrationId}`;
    }
}