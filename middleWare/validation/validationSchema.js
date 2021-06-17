const Joi = require('Joi')

const campgroundValidationSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().max(30),
        price: Joi.number().min(0).max(999999),
        image: Joi.string().required().max(100),
        location: Joi.string().required().max(30),
        description: Joi.string().max(100)
    }).required()

})

const reviewValidationSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().min(1).max(200),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})

const userValidationSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required().min(7).max(50),
        username: Joi.string().required().min(1).max(30),
        password: Joi.string().required().min(3).max(10)
    }).required()
})

module.exports = {campgroundValidationSchema, reviewValidationSchema, userValidationSchema}
