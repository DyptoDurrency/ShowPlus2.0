var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Exhibition = require("../models/exhibition");


// root route
router.get("/", function(req, res){
    res.render("landing");
});


// ===========================================
// AUTH ROUTES


//show register form
router.get("/register", function(req, res) {
    res.render("register");
});


// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({
            username: req.body.username, 
            firstName: req.body.firstName, 
            lastName: req.body.lastName, 
            email: req.body.email, 
            bio: req.body.bio, 
            avatar: req.body.avatar
        
    });
    if(req.body.adminCode === 'secretcode123') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to ShowPlus " + user.username);
            res.redirect("/exhibitions");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/exhibitions",
    failureRedirect: "login"
}), function(req, res) {
    
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/exhibitions");
});

//// USER PROFILE ROUTE

router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
        Exhibition.find().where('author.id').equals(foundUser._id).exec(function(err, foundExhibitions){
            if(err) {
                req.flash("error", "Something went wrong");
                res.redirect("/");  
            }
            res.render("users/show", {user: foundUser, exhibitions: foundExhibitions});
        });
    });
});

module.exports = router;