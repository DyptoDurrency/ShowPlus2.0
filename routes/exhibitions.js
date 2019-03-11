var express = require("express");
var router = express.Router();
var Exhibition = require("../models/exhibition");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// INDEX -- display a list of all
router.get("/", function(req,res){
        // Get all exhibitions from DB
        Exhibition.find({}, function(err, allExhibitions){
             if(err){
                console.log(err);
             } else {
               res.render("exhibitions/index", {exhibitions: allExhibitions});  
             }
        });
        
});

// Create - Create a new exhibition and add to DB
router.post("/", middleware.isLoggedIn, function(req, res){
   
    // get data from form and add to exhibition array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newExhibition = {name: name, price: price, image: image, description: desc, author: author};
    // Create a new exhibition and save to db
    Exhibition.create(newExhibition, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect back to exhibitions page
            // console.log(newlyCreated);
            req.flash("success", "Exhibition successfully added!");
            res.redirect("/exhibitions");
        }
    });
});

// NEW -- display form to add a new one
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("exhibitions/new");
});

//  SHOW - more info about one specific exhibition
router.get("/:id", function(req, res){
    // find exhibition with provided ID
    Exhibition.findById(req.params.id).populate("comments").exec(function(err, foundExhibition){
        if(err || !foundExhibition){
            console.log(err);
            req.flash('error', 'Sorry, that exhibition does not exist!');
            return res.redirect('/exhibitions');
        } else {
            // console.log(foundExhibition);
            // render show template with that specific exhibition
            res.render("exhibitions/show", {exhibition: foundExhibition});
        }
    });
});

// EDIT EXHIBITION ROUTE
router.get("/:id/edit", middleware.checkExhibitionOwnership, function(req, res) {
    Exhibition.findById(req.params.id, function(err, foundExhibition){
        if(err) {
            req.flash("error", "Exhibition not found");
        } else {
            res.render("exhibitions/edit", {exhibition: foundExhibition});
        }
    });
});

// UPDATE Exhibition ROUTE
router.put("/:id", middleware.checkExhibitionOwnership, function(req, res){
    // find and update the correct exhibition
    Exhibition.findOneAndUpdate({_id: req.params.id}, req.body.exhibition, {new:true}, function(err, updatedExhibition){
        if(err){
            res.redirect("/exhibitions");
        } else {
            req.flash("success", "Exhibition successfully updated!")
            res.redirect("/exhibitions/" + req.params.id);
        }
    });
    // redirect to show page
});

// DESTROY EXHIBITION ROUTE

router.delete("/:id", middleware.checkExhibitionOwnership, function(req, res){
    Exhibition.findOneAndRemove({_id: req.params.id}, function(err, removedExhibition){
        if(err){
            console.log(err);
            res.redirect("/exhibitions");
        }
        Comment.deleteMany({_id: { $in: removedExhibition.comments } }, function(err) {
                 if(err) {
                    console.log(err);
                }
                req.flash("success", "Exhibition successfully removed")
                res.redirect("/exhibitions");
        });
    });
});

module.exports = router;