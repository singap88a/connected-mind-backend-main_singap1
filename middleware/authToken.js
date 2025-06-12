const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const tokenHeader = authHeader && authHeader.split(' ')[1];
  // const token = req.cookies.token;

  // if (!token || !tokenHeader) {
  //   return res.status(401).json({ message: 'you Must be logged in' });
  // }

  if (!tokenHeader) {
    return res.status(401).json({ message: 'you Must be logged in' });
  }

  // if (token !== tokenHeader) {
  //   return res.status(401).json({ message: 'Token mismatch.' });
  // }

  jwt.verify(tokenHeader, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

module.exports = authToken;
