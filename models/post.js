const mongoose = require("mongoose");
const timestamps = require("mongoose-times");
const Schema = mongoose.Schema;

const postSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  image: {
    type: String
  },

  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.plugin(timestamps);

module.exports = mongoose.model("Post", postSchema);
