const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = Schema({
  name: {
    type: String,

    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,

    ref: "users",
  },

  location: {
    type: String,
  },

  type: {
    type: String,
  },

  expirience: {
    type: String,
  },

  role: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Job", jobSchema);
