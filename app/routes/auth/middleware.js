const moment = require('moment');
const jwt = require('jsonwebtoken');

const config = require('../../../config/config');

module.exports = (req, res, next) => {
  const token = req.get('X-Token');
  console.log('token'+token);
  req.user = {};
  req.isAdmin = false;
  if (token) {
    const decoded = jwt.verify(token, config.jwtSecret);
    // if (!moment.utc(decoded.expiresAt).isBefore(moment.utc())) {
    req.user = decoded.user;
    if (req.user.roles.includes('ROLE_ADMIN')) {
      req.isAdmin = true;
    }
  }
  next();
};
