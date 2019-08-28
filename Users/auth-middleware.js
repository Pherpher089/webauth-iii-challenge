const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");
module.exports = async (req, res, next) => {
	const token = req.headers.authorization;

	if (token) {
		jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
			if (err) {
				res.status(401).json({ errorMessage: "wutdaheck" });
			} else {
				req.decodedJwt = decodedToken;
				next();
			}
		});
	} else {
		res.status(500).json({ message: "no soup for you!" });
	}
};
