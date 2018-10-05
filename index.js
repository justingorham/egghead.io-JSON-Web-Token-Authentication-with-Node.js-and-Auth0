require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8888;
const SECRET = process.env.SECRET || "mysupersecretkey";

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

app.get("/status", (req, res) => {
    const localTime = (new Date()).toLocaleTimeString();

    res
        .status(200)
        .send(`Server time is ${localTime}.`);
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

            res.status(200).send({access_token})
        })

})

app.get("*", (req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});