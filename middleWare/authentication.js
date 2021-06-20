const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.referrer = req.originalUrl;
        req.flash('error', 'Please log in!')
        return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;