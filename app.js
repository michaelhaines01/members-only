const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bcrypt = require("bcryptjs");
const indexRouter = require("./routes/index");
const User = require("./models/users");
const app = express();
const exphbs = require("express-handlebars");
//Adds Dotenv
require("dotenv").config();
//MongoDb
const mongoose = require("mongoose");
const { handlebars } = require("hbs");
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.memvx.mongodb.net/members-only?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
//Passport config
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          console.log("Passwords match");
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  })
);
//this is the the session cookie data
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
app.set("views", path.join(__dirname, "views"));
const hbs = exphbs.create({
  defaultLayout: "layout",
  extname: ".hbs",
});
// view engine setup

//app.set("view engine", "hbs");
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

hbs.handlebars.registerHelper("avatar", function (user) {
  let avatar_img = `/images/${user.avatar}-clown.png`;
  return avatar_img;
});

hbs.handlebars.registerHelper("date", (date) => {
  let localtime = date.toLocaleString();
  return localtime;
});

hbs.handlebars.registerHelper("delete", (id) => {
  let deletepath = `/delete/${id}`;
  return deletepath;
});

hbs.handlebars.registerHelper("encodeMyString", function (inputData) {
  return new handlebars.SafeString(inputData);
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//Passport config
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);

app.use(passport.initialize());
app.use(passport.session());
//Router config
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(res.locals.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
