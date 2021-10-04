var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 20 },
  message: { type: String, required: true, maxLength: 250 },
  timestamp: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

MessageSchema.virtual("delete").get(function () {
  console.log("hi");
  return "/delete/" + this._id;
});

module.exports = mongoose.model("message", MessageSchema);
