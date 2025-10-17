const express = require('express');
const router = express.Router();
const adminCtl = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// 🔐 Only admin can access
router.use(verifyToken, checkRole(['admin']));

// Dashboard with counts
router.get('/', adminCtl.dashboard);

// Managers management
router.get('/managers', adminCtl.listManagers);

// Employees management
router.get('/employees', adminCtl.listEmployees);

// CRUD actions
router.post('/add-user', adminCtl.addUser);
router.post('/edit-user/:id', adminCtl.editUser);
router.get('/delete-user/:id', adminCtl.deleteUser);

router.get('/profile/:id', adminCtl.profilePage);
router.post('/profile/:id', adminCtl.updateProfile);



module.exports = router;
