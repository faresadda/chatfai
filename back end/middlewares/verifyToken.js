const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const asyncHandler=require('express-async-handler')

module.exports= asyncHandler((req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if(!authHeader) {
        const error = appError.createError(401,'token is required')
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
    
})
