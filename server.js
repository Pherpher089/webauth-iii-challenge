const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
	res.status(200).send("<h1>Hello from auth challenge 3!!!</h1>");
});

module.exports = server;
