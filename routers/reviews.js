// validation data
const {validateReqDataMW, canFindCamground} = require('../utils/validation/validateData')
// express validation
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')
// validation schema
const {reviewValidationSchema} = require('../middleWare/validation/validationSchema')
// model
const Campground = require('../models/campground')
const Review = require('../models/review')

const router = require('express').Router({mergeParams: true});

// POST /campgrounds/:id/reviews
router.post('/', validateReqDataMW(reviewValidationSchema) , catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!canFindCamground(campground)) {
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    const reviewData = req.body.review;
    if (!reviewData) throw new ExpressError("Invalid review data", 400);
    const review = new Review(reviewData);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully add the review!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE review in campground
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.deleteOne({_id: reviewId});  
    req.flash('success', `Successfully delete the review!`)
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;