var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// INDEX -- display a list of all
router.get("/", function(req,res){
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
             if(err){
                console.log(err);
             } else {
               res.render("campgrounds/index", {campgrounds: allCampgrounds});  
             }
        });
        
});

// Create - Create a new campground and add to DB
router.post("/", middleware.isLoggedIn, function(req, res){
   
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    // Create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds page
            // console.log(newlyCreated);
            req.flash("success", "Campground successfully created!");
            res.redirect("/campgrounds");
        }
    });
});

// NEW -- display form to add a new one
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//  SHOW - more info about one specific campground
router.get("/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/campgrounds');
        } else {
            // console.log(foundCampground);
            // render show template with that specific campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            req.flash("error", "Campground not found");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findOneAndUpdate({_id: req.params.id}, req.body.campground, {new:true}, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully updated!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect to show page
});

// DESTROY CAMPGROUND ROUTE

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findOneAndRemove({_id: req.params.id}, function(err, removedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        Comment.deleteMany({_id: { $in: removedCampground.comments } }, function(err) {
                 if(err) {
                    console.log(err);
                }
                req.flash("success", "Campground successfully removed")
                res.redirect("/campgrounds");
        });
    });
});

module.exports = router;