const express = require('express');
const router = express.Router();
const employeeCtl = require('../controllers/employee.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.use(verifyToken, checkRole(['employee', 'manager', 'admin']));

router.get('/', employeeCtl.dashboard);
router.get('/my-tasks', employeeCtl.myTasks);
router.post('/update-task/:id', employeeCtl.updateTaskStatus);

router.get('/profile/:id', employeeCtl.profilePage);
router.post('/profile/:id', employeeCtl.updateProfile);

router.post('/comment/:id', employeeCtl.addComment);

module.exports = router;
