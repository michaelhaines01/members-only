#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
  if (!userArgs[0].startsWith('mongodb')) {
      console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
      return
  }
  */
const async = require("async");
const Users = require("./models/users");
const Messages = require("./models/messages");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let users = [];
let messages = [];

function createuser(username, password, member, admin, cb) {
  let newuser = {
    username: username,
    password: password,
    member: member,
    admin: admin,
  };

  let user = new Users(newuser);

  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }

    users.push(user);
    cb(null, user);
  });
}

function createmessage(title, message, timestamp, id, cb) {
  let messagedetail = {
    title: title,
    message: message,
    timestamp: timestamp,
    user: id,
  };

  let post = new Messages(messagedetail);

  post.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }

    messages.push(post);
    cb(null, message);
  });
}

function makeuser(cb) {
  async.parallel(
    [
      function (callback) {
        createuser("michael", "1234", true, true, callback);
      },
      function (callback) {
        createuser(
          "kia",

          "1234",
          true,
          false,
          callback
        );
      },
    ],
    cb // optional callback
  );
}

function makemessage(cb) {
  async.parallel(
    [
      function (cb) {
        createmessage("hi", "hows it going", Date.now(), users[0].id, cb);
      },
      function (cb) {
        createmessage("hi", "hows it going", Date.now(), users[1].id, cb);
      },
      function (cb) {
        createmessage("gday", "boo ya", Date.now(), users[1].id, cb);
      },
      function (cb) {
        createmessage("boo", "fuck yea", Date.now(), users[0].id, cb);
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [makeuser, makemessage],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("here");
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
