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
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        console.log(hashedPassword.length);
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

exports.join = async (req, res, next) => {
  const secret = "pizza";
  if (secret === req.body.secret) {
    try {
      await User.findByIdAndUpdate(req.session.passport.user._id, {
        member: true,
      });
      req.session.passport.user.member = true;
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/login");
  }
};

exports.admin = async (req, res, next) => {
  const secret = "bbqchicken";

  if (secret === req.body.admin) {
    try {
      await User.findByIdAndUpdate(req.session.passport.user._id, {
        admin: true,
      });
      req.session.passport.user.admin = true;
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/");
  }
};
