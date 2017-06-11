const middlewares = require("../middlewares");
const yelp = require("yelp-fusion").client(process.env.YELP_TOKEN);//need to update this in 6 months apparently
console.log(process.env)

module.exports = (app, passport) => {

    app.get("/", (req, res) => {
        yelp.search({
            categories: "bars",
            location: "San Diego",
            term: "Beer"
        }).then(d => {
            res.send(d);
        }).catch(e => {
            console.log(e);
        })
    });

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
