const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
const userRouter = require("./Users/users-router.js");

const sessionOptions = {
	name: "mycookie",
	secret: "cookiesareyumyumiwantcookies",
	cookie: {
		maxAge: 1000 * 60 * 60,
		secure: false,
		httpOnly: true,
	},
	resave: false,
	saveUninitalized: false,
	store: new knexSessionStore({
		knex: require("./db-config.js"),
		tablename: "sessions",
		sidfieldname: "sid",
		createtable: true,
		clearinterval: 1000 * 60 * 60, //an hour
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
