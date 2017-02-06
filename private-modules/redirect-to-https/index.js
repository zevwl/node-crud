exports = module.exports = function redirectToHttps(req, res, next) {

    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === "production") {
        return res.redirect('https://' + req.hostname + req.originalUrl);
    }
    next();
};
