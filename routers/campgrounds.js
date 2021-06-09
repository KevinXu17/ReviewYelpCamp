const router = require('express').Router();
// express validation
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')

// validation schema
const {campgroundValidationSchema} = require('../middleWare/validation/validationSchema')
// model
const Campground = require('../models/campground')
// validation data
const {validateReqDataMW, canFindCamground} = require('../utils/validation/validateData')


router.get('/', catchAsync(async (req, res) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', {campgrounds: campgrounds, pageTitle: "campgrounds"})
    } catch (e) {
        console.log("Failed to load data")
        console.log(e)
    }
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new', {pageTitle: "newCampgroud"});
})
 
router.get('/:id', catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findOne({_id: id}).populate("reviews");
    if (!canFindCamground(campground, req)) {
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground: campground, pageTitle: campground.title})
}))

router.post('/', validateReqDataMW(campgroundValidationSchema), catchAsync(async (req, res) => {
    const campgroundData = req.body.campground;
    const campground = new Campground(campgroundData);
    await campground.save();
    req.flash('success', 'Successfully build a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findOne({_id: id});
    if (!canFindCamground(campground, req)) {
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", {campground:campground, pageTitle:'updateCampground'})
}))

// update campground
router.put('/:id', validateReqDataMW(campgroundValidationSchema), catchAsync(async (req, res) => {
    await Campground.updateOne({_id: req.params.id}, {...req.body.campground})
    req.flash('success', `Successfully update: ${req.body.campground.title}!`)
    res.redirect(`/campgrounds/${req.params.id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    await Campground.deleteOne({_id:req.params.id})
    req.flash('success', `Successfully delete the campground!`)
    res.redirect("/campgrounds")
}))

module.exports = router;