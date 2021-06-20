// validation data
const {validateReqDataMW, canFindCamground} = require('../utils/validation/validateData')
// express validation
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')
// validation schema
const {reviewValidationSchema} = require('../middleWare/validation/validationSchema')

const reviews = require('../controllers/reviews')

const isLoggedIn = require('../middleWare/authentication')
const isAuthor = require('../middleWare/authorization')

const router = require('express').Router({mergeParams: true});

// POST /campgrounds/:id/reviews
router.post('/', isLoggedIn, validateReqDataMW(reviewValidationSchema) , catchAsync(reviews.newReview))

// DELETE review in campground
router.delete('/:reviewId', isLoggedIn, isAuthor, catchAsync(reviews.deleteReview))

module.exports = router;