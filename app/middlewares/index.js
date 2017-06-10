module.exports = {
    forceLogin: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        else res.redirect("/login");
    }
};
