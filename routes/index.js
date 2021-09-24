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
  res.render("login");
});

router.get("/signup", function (req, res, next) {
  res.render("sign-up");
});
router.post("/signup", userController.signup);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/join", function (req, res, next) {
  res.render("member-join");
});
router.post("/join", userController.join);

router.get("/admin", function (req, res, next) {
  res.render("admin-form");
});
router.post("/admin", userController.admin);

router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/create-message", (req, res) => {
  res.render("create-message");
});
router.post("/create-message", messageController.postmesssage);

router.get("/delete/:id", messageController.deletemessage);

module.exports = router;
//e;
