const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  media_url: {
    type: String,
    required: true
  },
  media_caption: {
    type: String,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Media", mediaSchema);
