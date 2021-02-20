const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  following_userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Follow", followSchema);
