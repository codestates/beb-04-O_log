const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  visiterName: {
    type: String,
    // required: true,
  },
  ownerName: {
    type: String,
    // required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  contents: {
    type: String,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
