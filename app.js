const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')


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

// router
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', {campgrounds})
    } catch (e) {
        console.log("Failed to load data")
        console.log(e)
    }
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
 
app.get('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById({_id: id});
    res.render('campgrounds/show', {campground})
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById({_id: id})
    res.render("campgrounds/edit", {campground})
})

app.put('/campgrounds/:id', async (req, res) => {
    await Campground.updateOne({_id: req.params.id}, {...req.body.campground})
    res.redirect(`/campgrounds/${req.params.id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.deleteOne({_id:req.params.id})
    res.redirect("/campgrounds")
})




app.listen(port, ()=>{
    console.log(`The server is set up at ${port}`)
})