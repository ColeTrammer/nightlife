const mongoose = require("mongoose");

const Bar = new mongoose.Schema({
    id: String,
    usersGoing: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model("Bar", Bar);
