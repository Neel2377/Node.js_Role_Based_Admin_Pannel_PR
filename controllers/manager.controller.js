const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Task = require('../models/task.model');



exports.dashboard = async (req, res) => {
  try {
    const managerId = req.user._id;

    const employees = await User.find({ role: 'employee', $or: [{ createdBy: req.user._id }, { createdBy: { $exists: false } }] }).lean();
    const employeeIds = employees.map((e) => e._id);

    const totalTasks = await Task.countDocuments({ assignedBy: managerId });
    const pendingTasks = await Task.countDocuments({
      assignedBy: managerId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedBy: managerId,
      status: "Completed",
    });

    res.render("./pages/manager/dashboard", {
      user: req.user,
      employees,
      employeeCount: employees.length,
      totalTasks,
      pendingTasks,
      completedTasks,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    req.flash("error_msg", "Error loading manager dashboard");
    res.redirect("/manager");
  }
};


// 👥 Employee List (Team Page)
exports.listEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee', $or: [{ createdBy: req.user._id }, { createdBy: { $exists: false } }] }).lean();
    res.render('./pages/manager/employees', { user: req.user, employees });
  } catch (err) {
    console.error('Employee List Error:', err);
    req.flash('error_msg', 'Error loading employees');
    res.redirect('/manager');
  }
};

// ➕ Add Employee
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    await User.create({
      name,
      email,
      password,
      role: 'employee',
      createdBy: req.user._id
    });

    req.flash('success_msg', 'Employee added successfully');
    res.redirect('/manager/employees');
  } catch (err) {
    console.error('Add Employee Error:', err);
    req.flash('error_msg', 'Error adding employee');
    res.redirect('/manager/employees');
  }
};

// ✏️ Edit Employee
exports.editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    await User.findByIdAndUpdate(id, { name, email });

    req.flash('success_msg', 'Employee updated successfully');
    res.redirect('/manager/employees');
  } catch (err) {
    console.error('Edit Employee Error:', err);
    req.flash('error_msg', 'Error editing employee');
    res.redirect('/manager/employees');
  }
};

// ❌ Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Task.deleteMany({ assignedTo: id });

    req.flash('success_msg', 'Employee deleted successfully');
    res.redirect('/manager/employees');
  } catch (err) {
    console.error('Delete Employee Error:', err);
    req.flash('error_msg', 'Error deleting employee');
    res.redirect('/manager/employees');
  }
};

// Show Assign Task Page
// 🧾 Show Assign Task Page
exports.assignTaskPage = async (req, res) => {
  try {
    // 🔹 Show both — employees created by this manager and manually added (no createdBy)
    const employees = await User.find({
      role: 'employee',
      $or: [
        { createdBy: req.user._id },
        { createdBy: { $exists: false } } // manually added employees
      ]
    }).lean();

    if (!employees || employees.length === 0) {
      req.flash('error_msg', 'No employees available to assign task');
      return res.redirect('/manager/employees');
    }

    res.render('./pages/manager/assignTask', { user: req.user, employees });
  } catch (err) {
    console.error('Assign Task Page Error:', err);
    req.flash('error_msg', 'Error loading assign task page');
    res.redirect('/manager/dashboard');
  }
};


// 📋 Assign Task
exports.assignTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assignedTo } = req.body;
    await Task.create({
      title,
      description,
      priority,
      deadline,
      assignedBy: req.user._id,
      assignedTo,
    });
    req.flash("success_msg", "Task assigned successfully!");
    res.redirect("/manager/tasks");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Error assigning task");
    res.redirect("/manager/assignTask");
  }
};

// 🧾 All Tasks
exports.listTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user._id })
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .lean();

    res.render('./pages/manager/tasks', { user: req.user, tasks });
  } catch (err) {
    console.error('List Tasks Error:', err);
    req.flash('error_msg', 'Error loading tasks');
    res.redirect('/manager');
  }
};

// 📝 Update Task Status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Task.findByIdAndUpdate(id, { status });

    req.flash('success_msg', 'Task status updated successfully');
    res.redirect('/manager/tasks');
  } catch (err) {
    console.error('Update Task Status Error:', err);
    req.flash('error_msg', 'Error updating task status');
    res.redirect('/manager/tasks');
  }
};

// 🚪 Logout
exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  req.flash('success_msg', 'Logout successful');
  res.redirect('/user/login');
};

// Profile Page
exports.profilePage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/manager');
    }
    res.render('./pages/manager/profile', { user });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading profile');
    res.redirect('/manager');
  }
};

// POST Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, age, address, mobile, gender, bloodGroup } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, age, address, mobile, gender, bloodGroup });


    req.flash('success_msg', 'Profile updated successfully');
    res.redirect(`/manager/profile/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating profile');
    res.redirect(`/manager/profile/${req.params.id}`);
  }
};
