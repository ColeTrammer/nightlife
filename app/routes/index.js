module.exports = (app, passport) => {

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next();
        else res.redirect("/login");
    }

    app.get("/", isLoggedIn, (req, res) => {
        res.render("index");
    });

    app.get("/login", (req, res) => {
        res.render("login");
    });

    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/login");
    });

    app.get("/auth/twitter", passport.authenticate("twitter"));

    app.get("/auth/twitter/callback", passport.authenticate("twitter", {
        successRedirect: "/",
        failureRedirect: "/login"
    }));
};
