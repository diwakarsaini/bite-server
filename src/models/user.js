const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: [String],
    enum: ["Admin", "User", "HR"],
    default: ["User"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
