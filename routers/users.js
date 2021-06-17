const router = require('express').Router()
const User = require('../models/user')
const passport = require('passport');

// validation
const {userValidationSchema} = require('../middleWare/validation/validationSchema')
const {validateReqDataMW} = require('../utils/validation/validateData')

// GET register
router.get('/register', (req, res) => {
    res.render('users/register', {pageTitle: 'register'})
})

router.post('/register', validateReqDataMW(userValidationSchema), async (req, res, next) => {
    const {username, email, password} = req.body.user;
    try {
        const newUser = new User({email, username});
        const registerResult = await User.register(newUser, password)
        req.flash('success', `Welcome ${username}!`)
        req.login(registerResult, err => {
            if (err) return next(err);
        });
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
})

// GET login
router.get('/login', (req, res) => {
    res.render('users/login', {pageTitle: 'login'})
})

router.post('/login', 
            passport.authenticate('local', 
            {failureFlash: true, failureRedirect: "/login"})
, (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}!`);
    res.redirect(req.session.referrer);
})

router.get('/logout', (req, res) => {
    if (req.user) {
        req.logOut();
        req.flash('success', 'See you again!')
    }
    res.redirect('/campgrounds');
})


module.exports = router;