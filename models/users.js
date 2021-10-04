var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 15 },
  password: { type: String, required: true },
  member: { type: Boolean, default: false },
  avatar: {
    type: String,
    required: true,
    enum: ["bald", "ballon", "evil", "happy", "hat"],
    default: "happy",
  },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
