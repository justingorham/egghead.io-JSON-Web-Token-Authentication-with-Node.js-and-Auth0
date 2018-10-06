require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const expressjwt = require('express-jwt');
const serveStatic = require('serve-static')

const app = express();
const PORT = process.env.API_PORT || 8888;
const SECRET = process.env.SECRET || "mysupersecretkey";
const jwtCheck = expressjwt(require("./jwtCheck.json"));

const users = [{
        id: 1,
        username: "admin",
        password: "admin"
    },
    {
        id: 2,
        username: "guest",
        password: "guest"
    }
];

app.use(bodyParser.json());
app.use(cors());

app.use(serveStatic('public'))

app.get("/resource", (req, res) => {
    res.status(200).send("Public resource, you can see this")
});

app.get("/resource/secret", jwtCheck, (req, res) => {
    res.status(200).send("Secret resource, you should be logged in to see this")
});

app.get("*", (req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});