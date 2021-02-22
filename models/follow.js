const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followSchema = new Schema({
  following: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  followed: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Follow", followSchema);
