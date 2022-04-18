const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  date: {
    type: Date,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
