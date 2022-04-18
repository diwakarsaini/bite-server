const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = Schema({
  title: {
    type: String,
    require: [true, "Please add Blog title"],
  },
  date: {
    type: String,
    require: [true, "Please add published date"],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  description: {
    type: String,
    require: [true, "Please add Blog Description"],
  },
});

module.exports = mongoose.model("Blog", blogSchema);
