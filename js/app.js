var currentApp = null;

// Initiates QSE SaaS Login 
async function uiLogin() {
    await qseLogin();
    uiUpdateUserInfo();
}

// Update the UI components to reflect the user's login status
async function uiUpdateUserInfo() {
    try {
        const status = await qseGetUser();
        document.getElementById("UserID").innerText = "Welcome " + status;
        document.getElementById("LoginLink").innerText = "Logout";
        uiGetApps();
    } catch (err) {
        document.getElementById("UserID").innerText = "Please login to continue...";
        document.getElementById("LoginLink").innerText = "Login";
    }
}

// Populate the list of apps accessible by the current user
async function uiGetApps() {
    try {
        // fetch the list of available apps:
        const apps = await qseRequest('/api/v1/items?resourceType=app');
        const appList = document.getElementById('AppList');

        // Reset list of apps just in case we have already populated
        appList.innerHTML = '';

        // Every from here down is about displaying the resulting list of apps
        if (!apps.data.length) {
            document.getElementById('AppSelector').innerHTML = 'No apps available';
            return;
        } else {
            if (apps.data.length > 0) {
                for (i = 0; i < apps.data.length; i++) {
                    var itemNode = document.createElement("a");
                    itemNode.setAttribute("class", "dropdown-item");
                    itemNode.setAttribute("href", "#")
                    itemNode.setAttribute("onclick", "uiSelectApp('" + apps.data[i].name + "','" + apps.data[i].resourceId + "');");
                    var txtNode = document.createTextNode(apps.data[i].name);
                    itemNode.appendChild(txtNode);
                    appList.appendChild(itemNode);
                }
            }
            document.getElementById('AppSelector').style.display = "block";
        }
        return;
    } catch (err) {
        window.console.log('Error while setting up:', err);
    }
}

// Open the user selected app and display some details
async function uiSelectApp(appName, appResourceId) {

    // fetch the Cross-Site Request Forgery (CSRF) token:
    const res = await qseRequest('/api/v1/csrf-token', false);
    const csrfToken = res.headers.get('qlik-csrf-token');
    const path = '/app/' + appResourceId;

    // build a websocket URL:
    const url = `${tenantConfig.uri.replace('https','wss')}${path}?qlik-web-integration-id=${tenantConfig.webIntegrationId}&qlik-csrf-token=${csrfToken}`;

    // fetch the engine API schema:
    const schema = await (
        await fetch('https://unpkg.com/enigma.js@2.7.0/schemas/12.612.0.json')
    ).json();

    const session = window.enigma.create({ url, schema });

    const global = await session.open();

    // open the app, and fetch the layout:
    const app = await global.openDoc(appResourceId);
    const appLayout = await app.getAppLayout();

    // Reset contents of application info panel
    const appInfo = document.getElementById('AppInfo');
    appInfo.innerHTML = '';

    // construct HTML for app details    
    var p = document.createElement("p");
    var t = document.createTextNode("Application Title: " + appLayout.qTitle);
    p.appendChild(t);
    appInfo.appendChild(p);

    var p = document.createElement("p");
    var t = document.createTextNode("Description: " + appLayout.description);
    p.appendChild(t);
    appInfo.appendChild(p);

    p = document.createElement("p");
    t = document.createTextNode("Application ID: " + appLayout.id);
    p.appendChild(t);
    appInfo.appendChild(p);

    p = document.createElement("p");
    t = document.createTextNode("Application Owner: " + appLayout.owner);
    p.appendChild(t);
    appInfo.appendChild(p);

    p = document.createElement("p");
    t = document.createTextNode("Last Reload: " + appLayout.qLastReloadTime);
    p.appendChild(t);
    appInfo.appendChild(p);
}