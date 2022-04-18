const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = Schema({
  name: {
    type: String,

    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,

    ref: "users",
  },

  email: {
    type: String,
    required: true,
  },

  job: {
    type: Schema.Types.ObjectId,
    ref: "jobs",
  },

  resume: {
    type: String,
    required: true,
  },

  message: {
    type: String,
  },
});

module.exports = mongoose.model("Application", applicationSchema);
