const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./users-model.js");
const restricted = require("./auth-middleware.js");
const secrets = require("../config/secrets.js");

const router = express.Router();

router.get("/users", restricted, async (req, res) => {
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
		const [user] = await db.findUser(req.body.username);
		if (user && bcrypt.compareSync(passGuess, user.password)) {
			const token = generateToken(user);
			//req.session.user = user;
			res.status(200).json({
				message: `Welcome ${user.username}!`,
				token,
			});
		} else {
			res.status(401).json({ message: "invalid credentials" });
		}
	} catch ({ message }) {
		res.status(500).json(message);
	}
});

router.delete("/logout", restricted, async (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				res.send("unable to logout");
			} else {
				res.send("totsiens");
			}
		});
	} else {
		res.end();
	}
});

router.get("/token", async (req, res) => {
	const payload = { subject: "you have a token" };
	const secret = "this is a secret";
	const options = {
		expiresIn: "1h",
	};
	const tkn = jwt.sign(payload, secret, options);
	res.status(200).json({ token: tkn });
});

function generateToken(user) {
	const payload = {
		subject: user.id, // sub in payload is what the token is about
		username: user.username,
		// ...otherData
	};

	const options = {
		expiresIn: "1h", // show other available options in the library's documentation
	};

	// extract the secret away so it can be required and used where needed
	return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}

module.exports = router;

/**
    try {

    } catch ({message}) {
        res.status(500).json(message)
    }
 */
