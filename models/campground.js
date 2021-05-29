const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require('./review');

const CampgroundSchema = new Schema ({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// middleware post when delete => delete reviews
CampgroundSchema.post('findOneAndDelete', async function (data) {
    if (data) {
     await Review.remove({
         _id: {$in: data.reviews}
     })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema) 