require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8888;

app.use(bodyParser.json());

app.get("/status", (req, res) => {
    const localTime = (new Date()).toLocaleTimeString();

    res
        .status(200)
        .send(`Server time is ${localTime}.`);
});

app.post("/login", (req, res) => {
    const {
        username
    } = req.body;
    res
        .status(200)
        .send(`You logged in with ${username}`)
})

app.get("*", (req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});