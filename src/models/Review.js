const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = Schema({
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "restaurants",
  },
  picture: {
    type: String,
  },
  name: {
    type: String,
  },
  text: {
    type: String,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
