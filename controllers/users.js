const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/users");

exports.signup = [
  body("username").trim().isLength({ max: 30 }).escape(),
  body("password").trim().isLength({ max: 20 }).escape(),
  //sanitise the fields entered
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //handle this error somewhere
      console.log(errors);
    } else {
      bcrypt.hash("req.body.password", 10, (err, hashedPassword) => {
        if (err) {
          console.log(err);
        }

        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          admin: false,
          member: false,
        }).save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/login");
        });
      });
    }
  },
];
