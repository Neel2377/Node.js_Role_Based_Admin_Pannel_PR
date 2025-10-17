exports.isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Access Denied: Admin only' });
};

exports.isManager = (req, res, next) => {
  if (req.user.role === 'manager' || req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Access Denied: Manager only' });
};

exports.isEmployee = (req, res, next) => {
  if (req.user.role === 'employee' || req.user.role === 'manager' || req.user.role === 'admin')
    return next();
  return res.status(403).json({ message: 'Access Denied: Employee only' });
};
