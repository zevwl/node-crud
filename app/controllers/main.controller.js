module.exports = {
    // Show home page
    showHome: (req, res) => res.render('pages/home'),

    notFound: (req, res) => {
        res.status(404);
        res.render('pages/404');
    }
};
