const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campgroud = require('./models/campgroud')


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

app.get('/', (req, res) => {
    res.render('home')
})

// app.get('/makecampground', async (req, res) => {
//     const camp = new Campgroud ({
//         title: "camp1",
//         price: "20",
//         description: "camp1 is good",
//         location: "Vancouver"
//     })
//     try {
//         const c = await camp.save();
//         console.log(c)
//     } catch (e) {
//         console.log("Failed to save the new camp")
//     }
// })

app.listen(port, ()=>{
    console.log(`The server is set up at ${port}`)
})