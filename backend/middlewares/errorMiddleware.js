const appError=require('../utils/appError')

const errorMiddleware = (err, req, res, next) => {
    res.status(400).json(appError.createError(400,err.message));
  };
  
  module.exports = errorMiddleware;
  