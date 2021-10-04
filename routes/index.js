var express = require("express");

var router = express.Router();

const passport = require("passport");

//Passport for sign in

const userController = require("../controllers/users.js");
const messageController = require("../controllers/messages.js");

/* GET home page. */
router.get("/", messageController.messages);
router.post("/");

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.session.message });
});

router.get("/signup", function (req, res, next) {
  res.render("sign-up");
});

router.post("/signup", userController.signup);

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.session.message = "Invalid username or password"; //or whateve
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/join", function (req, res, next) {
  if (!req.isAuthenticated()) {
    throw new Error("You must sign up and login before you can join.");
  }
  res.render("member-join", {
    member: req.session.passport.user.member,
    admin: req.session.passport.user.admin,
  });
});
router.post("/join", userController.join);

router.get("/admin", function (req, res, next) {
  res.render("admin-form", {
    member: req.session.passport.user.member,
    admin: req.session.passport.user.admin,
  });
});

router.post("/admin", userController.admin);

router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/create-message", (req, res) => {
  res.render("create-message", {
    member: req.session.passport.user,
    admin: req.session.passport.user.admin,
  });
});
router.post("/create-message", messageController.postmesssage);

router.get("/delete/:id", messageController.deletemessage);

module.exports = router;
