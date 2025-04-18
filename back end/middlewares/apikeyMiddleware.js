const appError = require('../utils/appError');
require('dotenv').config()
const asyncHandler=require('express-async-handler')

module.exports= asyncHandler((req, res, next) => {
    const apiKey = req.headers['x-api-key'] ;
    console.log("HEADER API KEY:", apiKey);
    console.log("ENV API KEY:", process.env.MY_API_KEY);
    if(!apiKey || apiKey!==process.env.MY_API_KEY) {
        const error = appError.createError(400,'invalid api key')
        return next(error);
    }
    next();
    
})