const { Router } = require("express");
const router = Router();
const adminCtl = require('../controllers/admin.controller');
const userCtl = require('../controllers/user.controller');

const userRouter = require('./user.routes');
const adminRouter = require('./admin.routes');
const managerRouter = require('./manager.routes');
const employeeRouter = require('./employee.routes');

router.get('/', (req,res)=>{
    return res.render('./pages/login')
});
router.use('/user', userRouter);        
router.use('/admin', adminRouter);          
router.use('/manager', managerRouter);  
router.use('/employee', employeeRouter);

router.get('/logout',userCtl.logoutUser)
module.exports = router;
