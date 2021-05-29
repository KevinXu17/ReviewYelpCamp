const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
const Review = require('./models/review')
const methodOverride = require('method-override')
const ejsMat = require('ejs-mate')
// express validation
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/expressError')
const Joi = require('joi');
// validation schema
const campgroundValidationSchema = require('./middleWare/validation/validationSchema')
const reviewValidationSchema = require('./middleWare/validation/validationSchema')

// app
const app = express()
const port = 3000


// mongoose
const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
const uri = 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(uri, 
mongooseOptions).catch(error => console.log("Failed to connect database"))

const db = mongoose.connection;
db.on("error", console.error.bind(console.log, "connection error:"));
db.once("open", ()=> {
    console.log("Database connected")
})


// ejs
app.set('view engine', 'ejs')
// path
app.set('views', path.join(__dirname, "views"))
// parser
app.use(express.urlencoded({extended: true}))
// method-override
app.use(methodOverride('_method'))
// ejs-mate
app.engine('ejs', ejsMat)

// Joi middleware  should not be here: TODO
const validateReqDataMW = (validationSchema) => {
    return (req, res, next) => {
        const {error} = validationSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(';')
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    } 
}

const checkCampground = (campground) => {
    if (!campground) throw new ExpressError("Can not find the Campground.", 400);
}


// routerht
app.get('/', (req, res) => {
    res.render('home', {pageTitle: "home"})
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', {campgrounds: campgrounds, pageTitle: "campgrounds"})
    } catch (e) {
        console.log("Failed to load data")
        console.log(e)
    }
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new', {pageTitle: "newCampgroud"});
})
 
app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById({_id: id}).populate("reviews");
    checkCampground(campground);
    res.render('campgrounds/show', {campground: campground, pageTitle: campground.title})
}))

app.post('/campgrounds', validateReqDataMW(campgroundValidationSchema), catchAsync(async (req, res) => {
    const campgroundData = req.body.campground;
    checkCampground(campground);
    const campground = new Campground(campgroundData);
    await campground.save();
    res.redirect(`/campgrounds/${campgroundData._id}`)
}))

// POST /campgrounds/:id/reviews
app.post('/campgrounds/:id/reviews', validateReqDataMW(reviewValidationSchema) , catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    checkCampground(campground);
    const reviewData = req.body.review;
    if (!reviewData) throw new ExpressError("Invalid review data", 400);
    const review = new Review(reviewData);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE review in campground
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.deleteOne({_id: reviewId});  
    res.redirect(`/campgrounds/${id}`);
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById({_id: id})
    res.render("campgrounds/edit", {campground:campground, pageTitle:'updateCampground'})
}))

app.put('/campgrounds/:id', validateReqDataMW(campgroundValidationSchema), catchAsync(async (req, res) => {
    await Campground.updateOne({_id: req.params.id}, {...req.body.campground})
    res.redirect(`/campgrounds/${req.params.id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    await Campground.findOneAndDelete({_id:req.params.id})
    res.redirect("/campgrounds")
}))

// catch error path
app.get('/*', (req, res) => {
    next(new ExpressError("Page Not Found!", 404));
})

// error route
app.use((err, req, res, next) => {
   const {statusCode = 500, message = "Error"} = err;
    res.status(statusCode).render("error/error", {pageTitle:'error', err});
})


app.listen(port, ()=>{
    console.log(`The server is set up at ${port}`)
})