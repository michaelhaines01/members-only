const Messages = require("../models/messages");
const { body, validationResult } = require("express-validator");

exports.messages = (req, res, next) => {
  Messages.find()
    .lean()
    .populate("user")
    .exec((err, messages) => {
      if (err) {
        return next(err);
      } else if (req.isAuthenticated()) {
        res.render("messages", {
          messages: messages,
          member: req.session.passport.user.member,
          admin: req.session.passport.user.admin,
        });
      } else {
        res.render("messages", {
          messages: messages,
        });
      }
    });
};

exports.postmesssage = [
  body("title").trim().isLength({ max: 25 }).escape(),
  body("message").trim().isLength({ max: 200 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("create-message", {
        errors: errors.array(),
      });
    } else {
      let message = new Messages({
        title: req.body.title,
        message: req.body.message,
        timestamp: new Date(),
        user: req.user.id,
      });
      message.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

exports.deletemessage = (req, res, next) => {
  Messages.findByIdAndDelete(req.params.id).exec(function (err, product) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
