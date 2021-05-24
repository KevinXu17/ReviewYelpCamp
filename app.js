const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMat = require('ejs-mate')
// express validation
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/expressError')
const Joi = require('joi');
const campgroundValidationSchema = require('./middleWare/validation/campgroundValidationSchema')


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
const validateCampground = (validationSchema) => {
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


// router
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
    try {
        const campground = await Campground.findById({_id: id});
        res.render('campgrounds/show', {campground: campground, pageTitle: campground.title})
    } catch (e) {
        throw new ExpressError(`Can not find the campgroud ID: ${id}!`, 400);
    }
}))

app.post('/campgrounds', validateCampground(campgroundValidationSchema), catchAsync(async (req, res) => {
    const campgroundData = req.body.campground;
    if (!campgroundData) throw new ExpressError("Invalid campground data", 400);
    const campground = new Campground(campgroundData);
    await campground.save();
    res.redirect(`/campgrounds/${campgroundData._id}`)
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById({_id: id})
    res.render("campgrounds/edit", {campground:campground, pageTitle:'updateCampground'})
}))

app.put('/campgrounds/:id', validateCampground(campgroundValidationSchema), catchAsync(async (req, res) => {
    await Campground.updateOne({_id: req.params.id}, {...req.body.campground})
    res.redirect(`/campgrounds/${req.params.id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    await Campground.deleteOne({_id:req.params.id})
    res.redirect("/campgrounds")
}))

// catch error path
app.get('/*', (req, res) => {
    next(new ExpressError("Page Not Found!", 404));
})

app.use((err, req, res, next) => {
   const {statusCode = 500, message = "Error"} = err;
    res.status(statusCode).render("error/error", {pageTitle:'error', err});
})


app.listen(port, ()=>{
    console.log(`The server is set up at ${port}`)
})