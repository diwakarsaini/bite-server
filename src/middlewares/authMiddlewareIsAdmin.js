const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({ msg: "No token, authorization denied" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    if (req.user.role[0] !== "Admin") {
      throw new Error();
    }
    next();
  } catch (err) {
    console.log(req.user);
    res.status(401).json({
      msg: "user is not admin",
    });
  }
};
