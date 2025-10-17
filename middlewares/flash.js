const addFlash = (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')[0] || null;
    res.locals.error_msg = req.flash('error_msg')[0] || null;
    next();
}

module.exports = addFlash;