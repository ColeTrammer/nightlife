const Bar = require("../models/bars.js");

module.exports = {
    requireLogin: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        else res.send({error: "log in"});
    },
    findBar: (req, res, next) => {
        if (req.params && req.params.id) {
            Bar.findOne({"id": req.params.id}, (err, bar) => {
                if (err) return next();
                if (bar) {
                    req.bar = bar;
                    next();
                } else {
                    Bar.create({id: req.params.id}, (err, bar) => {
                        if (err) return next();
                        else {
                            req.bar = bar;
                            next();
                        }
                    });
                }
            });
        } else {
            res.send({error: "Input a poll id."});
        }
    }
};
