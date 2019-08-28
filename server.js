const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-sessions");
const knexSessionStore = require("connect-session-knex")(session);
const userRouter = require("./Users/users-router.js");

const sessionOptions = {
	name: "myCookie",
	secret: "c00kiesRg00dMeWantK00Cies",
	cookie: {
		maxAge: 100 * 60 * 60,
		secure: false,
		httpOnly: true,
	},
	resave: false,
	saveUninitalised: false,
	store: new knexSessionStore({
		knex: require("./bd-config.js"),
		tablename: "sessions",
		sidfieldname: "sid",
		createtable: true,
		clearinterval: 1000 * 60 * 60,
	}),
};

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));
server.use("/api", userRouter);

server.get("/", (req, res) => {
	res.status(200).send("<h1>Hello from auth challenge 3!!!</h1>");
});

module.exports = server;
