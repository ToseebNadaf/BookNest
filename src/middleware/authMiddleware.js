const jwt = require("jsonwebtoken");
const translate = require("../utils/translate");

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const lang = req.headers["accept-language"] || "en";

  if (!token) {
    return res.status(401).json({
      message: translate("AUTHENTICATION_REQUIRED", lang),
      success: false,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: translate("INVALID_TOKEN", lang),
        success: false,
      });
    }

    req.user = user;
    next();
  });
};

module.exports = { validateToken };
