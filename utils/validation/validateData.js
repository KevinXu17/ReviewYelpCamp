const ExpressError = require('../expressError')
const ObjectId = require('mongoose').Types.ObjectId;
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

const canFindCamground = (campground, req) => {
    if (!campground) {
        req.flash('error', 'Can not find the campground!')
        return false;
    };
    return true;
}


module.exports = {validateReqDataMW, canFindCamground}