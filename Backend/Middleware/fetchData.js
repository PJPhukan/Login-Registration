const jwt = require("jsonwebtoken");

const fetchData = (req, res, next) => {
  // get the user from the jwt token and append id to the req object
  const token = req.header("auth-Token");
  if (!token) {
    res.status(401).json({ error: "Please authonticate using a valid user " });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(data.user);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authonticate using a valid user " });
  }
};

module.exports = fetchData;
