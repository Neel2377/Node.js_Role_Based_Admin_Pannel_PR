const express = require('express');
const router = express.Router();
const managerCtl = require('../controllers/manager.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// 🔐 Only manager or admin
router.use(verifyToken, checkRole(['manager', 'admin']));

// Dashboard
router.get('/', managerCtl.dashboard);

// Employees (Team)
router.get('/employees', managerCtl.listEmployees);
router.post('/add-employee', managerCtl.addEmployee);
router.post('/edit-employee/:id', managerCtl.editEmployee);
router.get('/delete-employee/:id', managerCtl.deleteEmployee);

// Tasks
router.get('/tasks', managerCtl.listTasks);
router.get('/assign-task', managerCtl.assignTaskPage);
router.post('/assign-task', managerCtl.assignTask);

router.get('/profile/:id', managerCtl.profilePage);
router.post('/profile/:id', managerCtl.updateProfile);

module.exports = router;
