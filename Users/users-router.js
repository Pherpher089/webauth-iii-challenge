const express = require("express");
const bcrypt = require("bcrypt");

const db = require("./users-model.js");

const router = express.Router();

router.get("/users", async (req, res) => {
	try {
		const users = await db.getUsers();
		res.status(201).json(users);
	} catch ({ message }) {
		res.status(500).json(message);
	}
});

router.post("/register", async (req, res) => {
	const user = req.body;
	const hash = bcrypt.hashSync(user.password, 12);
	user.password = hash;

	try {
		const saved = await db.register(user);
		res.status(201).json(saved);
	} catch ({ message }) {
		res.status(500).json(message);
	}
});

router.post("/login", async (req, res) => {
	const passGuess = req.body.password;
	try {
		const [user] = db.findUser(req.body.username);
		if (user && bcrypt.compareSync(passGuess, user.password)) {
		}
	} catch ({ message }) {
		res.status(500).json(message);
	}
});

module.exports = router;

/**
    try {

    } catch ({message}) {
        res.status(500).json(message)
    }
 */
