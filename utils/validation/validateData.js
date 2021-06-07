const ExpressError = require('../expressError')
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

module.exports = {validateReqDataMW, checkCampground}