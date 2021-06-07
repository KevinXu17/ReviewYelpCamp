const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMat = require('ejs-mate')
// express validation
const ExpressError = require('./utils/expressError')
const {campgroundValidationSchema, reviewValidationSchema} = require('./middleWare/validation/validationSchema')
// router
const campgroundsRouter = require('./routers/campgrounds')
const reviewRouter = require('./routers/reviews')
// app
const app = express()
const port = 3000


// mongoose
const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
const uri = 'mongodb://campgrounds:campgrounds@127.0.0.1:27018/yelp-camp?authSource=admin'
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

// router
app.use('/campgrounds', campgroundsRouter);
// need to set mergeParams to true in router => to get :id
app.use('/campgrounds/:id/reviews', reviewRouter);


// routerht
app.get('/', (req, res) => {
    res.render('home', {pageTitle: "home"})
})

// catch error path
app.get('/*', (req, res, next) => {
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