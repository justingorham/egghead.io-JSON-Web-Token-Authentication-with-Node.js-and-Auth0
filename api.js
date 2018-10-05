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
const jwtCheck = expressjwt({
    secret: SECRET
});

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

app.post("/login", (req, res) => {
    const {
        username,
        password
    } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .send("You need a username and password");
    }

    Promise.resolve(users.find((u) => {
            return u.username === username && u.password === password;
        }))
        .then(user => {
            if (!user) {
                return res.status(401).send("User not found");
            }
            const access_token = jwt.sign({
                sub: user.id,
                username: user.username
            }, SECRET, {
                expiresIn: "3 hours"
            });

            res.status(200).send({
                access_token
            })
        })

})

app.get("*", (req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});