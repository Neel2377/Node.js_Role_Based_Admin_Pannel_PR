const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.model'); // add this


exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token; // cookie-parser required
  if (!token) return res.redirect('/user/login');

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY); // { id, role }

    // DB se full user fetch karo
    const user = await User.findById(decoded.id).lean(); // lean() -> simple object
    if (!user) return res.redirect('/user/login');

    req.user = user; // full user object
    res.locals.user = user; // EJS me accessible

    next();
  } catch (err) {
    console.log('JWT Error:', err);
    return res.redirect('/user/login');
  }
};


exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).send('Access denied');
    }
    next();
  };
};

exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user; // EJS templates me accessible
    next();
  } else {
    res.redirect('/user/login');
  }
};
