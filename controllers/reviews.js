const Campground = require('../models/campground')
const Review = require('../models/review')
const {canFindCamground} = require('../utils/validation/validateData')

module.exports.newReview = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!canFindCamground(campground)) {
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    const reviewData = req.body.review;
    if (!reviewData) throw new ExpressError("Invalid review data", 400);
    const review = new Review(reviewData);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully add the review!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.deleteOne({_id: reviewId});  
    req.flash('success', `Successfully delete the review!`)
    res.redirect(`/campgrounds/${id}`);
}