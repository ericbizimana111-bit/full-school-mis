const rateLimit = require('express-rate-limit'); // General rate limiter 


exports.limiter = rateLimit({

    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per  windowMs 
    message: 'Too many requests from this IP, please try again later.'

}); 


// Auth  rate limiter(stricter)
exports.authLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again later.'

});
