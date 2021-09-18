var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 15 },
  last_name: { type: String, required: true, maxLength: 15 },
  email: { type: String, required: true, maxLength: 15 },
  password: { type: String, required: true, maxLength: 15 },
});

UserSchema.virtual("name").get(function () {
  return this.first_name + this.last_name;
});

module.exports = mongoose.model("User", UserSchema);
