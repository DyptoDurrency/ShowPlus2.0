var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {type: String, default: 'https://images.unsplash.com/photo-1525389999255-82bad487f23c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=30'},
    firstName: String,
    lastName: String,
    email: String,
    bio: {type: String, default: 'If you\'re reading this I must be new here. And lazy.'},
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);