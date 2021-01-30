const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile_pic_url: {
    type: String,
    required: false
  },
  createdMedias: [
    {
      type: Schema.Types.ObjectId,
      ref: "Media"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
