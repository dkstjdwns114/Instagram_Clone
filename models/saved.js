const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const savedSchema = new Schema({
  media: {
    type: Schema.Types.ObjectId,
    ref: "Media"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Saved", savedSchema);
