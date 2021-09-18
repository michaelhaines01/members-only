var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 20 },
  message: { type: String, required: true, maxLength: 250 },
  timestamp: { type: Date, default: Date.now },
  member: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  id: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("message", MessageSchema);
