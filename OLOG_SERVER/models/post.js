const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
  },
  blogLink: {
    type: String,
    // required: true,
  },
  postImageUrl: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  title: {
    type: String,
  },
  faviconUrl: {
    type: String,
  },
});

module.exports = mongoose.model("Post", postSchema);
