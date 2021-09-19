var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 15 },

  password: { type: String, required: true, maxLength: 72 },
  member: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
