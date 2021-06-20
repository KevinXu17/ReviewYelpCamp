const Campground = require('../models/campground')
const Review = require('../models/review')
const isAuthor = async (req, res, next) => {
        const {id, reviewId} = req.params;
        var data;
        if (reviewId) {
            data = await Review.findById(reviewId);
        } else {
            data = await Campground.findById(id);
        }
        
        if (!req.user._id.equals(data.author)) {
            req.flash('error', 'You do not have the permission.')
            return res.redirect(`/campgrounds/${id}`);
        }
        next();  
}

module.exports = isAuthor;