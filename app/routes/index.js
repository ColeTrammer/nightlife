const middlewares = require("../middlewares");
const bars = require("../controllers/bars.js");

module.exports = (app, passport) => {

    app.get("/", (req, res) => {
        res.render("index", {search: req.session.search});
    });

    app.get("/api/search", bars.search);

    app.get("/api/add_user/:id", middlewares.requireLogin, middlewares.findBar, bars.addUser);

    app.get("/api/remove_user/:id", middlewares.requireLogin, middlewares.findBar, bars.removeUser);

    app.get("/login", (req, res) => {
        res.redirect("/auth/twitter");
    });

    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });

    app.get("/auth/twitter", passport.authenticate("twitter"));

    app.get("/auth/twitter/callback", passport.authenticate("twitter", {
        successRedirect: "/",
        failureRedirect: "/"
    }));

    app.get("*", (req, res) => {
        res.redirect("/");
    });
};
