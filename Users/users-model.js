const db = require("../bd-config.js");

module.exports = {
	register,
	getUsers,
	findUser,
};

function register(newUser) {
	return db("users").insert(newUser);
}

function getUsers() {
	return db("users");
}

function findUser(username) {
	return db("users").where({ username });
}
