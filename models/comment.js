const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  media: {
    type: Schema.Types.ObjectId,
    ref: "Media"
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Number,
    required: true
  },
  media_comment: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Commented", commentSchema);
