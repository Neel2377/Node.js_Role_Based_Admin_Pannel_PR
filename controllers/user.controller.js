const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Render Signup Page
exports.signupPage = (req, res) => {
  res.render('./pages/register');
};

// Render Login Page
exports.loginPage = (req, res) => {
  res.render('./pages/login');
};

// 🧩 Signup User
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error_msg', 'User with this email already exists');
      return res.redirect('/user/signup');
    }


    // Create user
    await User.create({ name, email, password, role });

    req.flash('success_msg', 'Signup successful! Please login');
    res.redirect('/user/login');
  } catch (err) {
    console.log('Signup Error:', err);
    req.flash('error_msg', 'Error signing up');
    res.redirect('/user/signup');
  }
};

// 🔐 Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/user/login');
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      req.flash('error_msg', 'Invalid password');
      return res.redirect('/user/login');
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.PRIVATE_KEY,
      { expiresIn: '1d' }
    );

    // Set token in cookie
    res.cookie('token', token, { httpOnly: true });

    req.flash('success_msg', 'Login successful');

    // Redirect based on role
    switch (user.role) {
      case 'admin':
        return res.redirect('/admin');
      case 'manager':
        return res.redirect('/manager');
      case 'employee':
        return res.redirect('/employee');
      default:
        return res.redirect('/user/login');
    }
  } catch (err) {
    console.log('Login Error:', err);
    req.flash('error_msg', 'Login error');
    res.redirect('/user/login');
  }
};

// 🚪 Logout
exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  req.flash('success_msg', 'Logout successful');
  res.redirect('/user/login');
};
