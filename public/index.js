const API_URL = "http://localhost:5000";

let ACCESS_TOKEN;
const webAuthPromise = fetch("./webAuth.json")
    .then(resp => resp.json())
    .then(data => new auth0.WebAuth({ ...data,
        redirectUri: window.location.href
    }));

const headlineBtn = document.querySelector("#headline");
const secretBtn = document.querySelector("#secret");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");

headlineBtn.addEventListener("click", () => {
    fetch(`${API_URL}/resource`).then(resp => {
        UIUpdate.updateCat(resp.status)
        return resp.text()
    }).then(data => {
        UIUpdate.alertBox(data)
    });
});

secretBtn.addEventListener("click", (event) => {
    let headers = {};
    if (ACCESS_TOKEN) {
        headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    }
    fetch(`${API_URL}/resource/secret`, {
        headers
    }).then(resp => {
        UIUpdate.updateCat(resp.status)
        return resp.text()
    }).then(data => {
        UIUpdate.alertBox(data)
    });
});

logoutBtn.addEventListener("click", (event) => {
    ACCESS_TOKEN = undefined;
    UIUpdate.loggedOut();
});

loginBtn.addEventListener("click", (event) => {
    webAuthPromise.then(webAuth => webAuth.authorize());
});

const parseHash = () => {
    webAuthPromise
        .then(webAuth => webAuth.parseHash(function (err, authResult) {
            if (authResult && authResult.idToken) {
                window.location.hash = '';
                ACCESS_TOKEN = authResult.idToken;
                localStorage.setItem("access_token", ACCESS_TOKEN)
                UIUpdate.loggedIn();
            }
        }));
}

window.addEventListener("DOMContentLoaded", parseHash);