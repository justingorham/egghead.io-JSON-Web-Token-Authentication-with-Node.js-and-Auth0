const API_URL = "http://localhost:5000";
const AUTH_URL = "http://localhost:5000"; //Keeping them on same port to minimize example code

let ACCESS_TOKEN;

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
    fetch(`${AUTH_URL}/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(UIUpdate.getUsernamePassword())
        })
        .then(resp => {
            UIUpdate.updateCat(resp.status);
            return resp.status == 200 ? resp.json() : resp.text();
        })
        .then(data => {
            if (data.access_token) {
                ACCESS_TOKEN = data.access_token;
                data = `Access Token: ${ACCESS_TOKEN}`
                UIUpdate.loggedIn();
            }
            UIUpdate.alertBox(data);
        })
});