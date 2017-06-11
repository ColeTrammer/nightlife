const Bar = require("../models/bars.js");
const User = require("../models/users.js");
const yelp = require("yelp-fusion").client(process.env.YELP_TOKEN);//need to update this in 6 months apparently

module.exports = {
    //addUser and removeUser
    //assumes the user is logged in
    //have middleware to put bar requested in req.bar
    addUser: (req, res) => {
        req.bar.usersGoing.push(req.user._id);
        req.bar.save((err) => {
            if (err) res.send({error: err});
            else res.send({success: true});
        });
    },
    removeUser: (req, res) => {
        req.bar.usersGoing.remove(req.user._id);
        req.bar.save((err) => {
            if (err) res.send({error: err});
            else res.send({success: true});
        });
    },
    search: (req, res) => {
        req.session.search = req.query.location;
        yelp.search({
            categories: "bars",
            location: req.query.location
        }).then((data) => {
            Bar.find({}, (err, bars) => {
                data.jsonBody.businesses.forEach((bar_yelp) => {
                    let found = false;

                    bars.forEach((bar_model) => {
                        if (bar_model.id === bar_yelp.id) {
                            found = true;
                            bar_yelp.usersGoing = bar_model.usersGoing.length;
                            if (req.user) {
                                bar_model.usersGoing.forEach((user_id) => {
                                    if (req.user._id.equals(user_id)) {
                                        bar_yelp.going = true;
                                    }
                                });
                            }
                        }
                    });

                    if (!found) {
                        bar_yelp.usersGoing = 0;
                    }
                });
                res.send(data.jsonBody.businesses);
            });
        }).catch((e) => {
            throw e;
        });
    }
};
