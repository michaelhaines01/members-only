const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/users");

exports.signup = [
  body("username").trim().isLength({ max: 30 }).escape(),
  check("password").trim().isLength({ max: 20 }).exists(),
  check(
    "confirmpassword",
    "passwordConfirmation field must have the same value as the password field"
  )
    .exists()
    .custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("sign-up", { error: errors.array()[0].msg });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        console.log(req.body.avatar);
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          admin: false,
          member: false,
          avatar: req.body.avatar,
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
      return next(err);
    }
  } else {
    res.render("member-join", {
      error: "Invalid Password",
    });
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
    res.render("admin-form", {
      error: "Invalid Password",
    });
  }
};
