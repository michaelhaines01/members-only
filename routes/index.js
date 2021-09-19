var express = require("express");
const users = require("../models/users");
var router = express.Router();
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

//Passport for sign in
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      console.log(user.id);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const userController = require("../controllers/users.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("sign-up", { title: "Sign up" });
});

router.post("/", userController.signup);

router.get("/login", function (req, res, next) {
  res.render("login");
});

module.exports = router;
