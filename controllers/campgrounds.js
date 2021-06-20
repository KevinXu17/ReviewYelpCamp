const Campground = require("../models/campground")
const {canFindCamground} = require('../utils/validation/validateData')



module.exports.listCampgrounds = async (req, res) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', {campgrounds: campgrounds, pageTitle: "campgrounds"})
    } catch (e) {
        console.log("Failed to load data")
        console.log(e)
    }
}

module.exports.newFormPage = (req, res) => {
    res.render('campgrounds/new', {pageTitle: "newCampgroud"});
}

module.exports.campground = async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findOne({_id: id})
    // populate author in each review
    .populate({path:"reviews",populate: {path: "author"}})
    // populate author of campground
    .populate("author");
    if (!canFindCamground(campground, req)) {
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground: campground, pageTitle: campground.title, currentUser: req.user})
}

module.exports.newCampground = async (req, res) => {
    const campgroundData = req.body.campground;
    const author = req.user._id;
    const campground = new Campground(campgroundData);
    campground.author = author;
    await campground.save();
    req.flash('success', 'Successfully build a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findOne({_id: id});
    if (!canFindCamground(campground, req)) {
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", {campground:campground, pageTitle:'updateCampground'})
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    await Campground.updateOne({_id: req.params.id}, {...req.body.campground});
    req.flash('success', `Successfully update: ${req.body.campground.title}!`);
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    await Campground.deleteOne({_id:req.params.id});
    req.flash('success', `Successfully delete the campground!`)
    res.redirect("/campgrounds")
}