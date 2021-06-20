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
// authorization
const isLoggedIn = require('../middleWare/authentication');
const isAuthor = require('../middleWare/authorization')

const campgrounds = require('../controllers/campgrounds')

// show all campgrounds
router.get('/', catchAsync(campgrounds.listCampgrounds));
// new campground page
router.get('/new', isLoggedIn, campgrounds.newFormPage)
 // show campground
router.get('/:id', catchAsync(campgrounds.campground))
// add new campground
router.post('/', isLoggedIn, validateReqDataMW(campgroundValidationSchema), catchAsync(campgrounds.newCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.edit))

// update campground
router.put('/:id', isLoggedIn, isAuthor, validateReqDataMW(campgroundValidationSchema), catchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;