const router = require('express').Router()
const User = require('../models/user')
// express validation
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')

// GET register
router.get('/register', (req, res) => {
    res.render('users/register', {pageTitle: 'register'})
})

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body.user;
    try {
        const newUser = new User({email, username});
        const registerResult = await User.register(newUser, password)
        req.flash('success', `Welcome ${username}!`)
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
})



module.exports = router;