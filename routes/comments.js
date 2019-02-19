var express = require("express");
var router = express.Router({mergeParams: true});
var Exhibition = require("../models/exhibition");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ===========================================
// COMMENTS ROUTE
// ===========================================
// comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find exhibition by id
    Exhibition.findById(req.params.id, function(err, exhibition){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {exhibition: exhibition});
        }
    });
});

// comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    //look up exhibition using ID
    Exhibition.findById(req.params.id, function(err, exhibition) {
        if(err){
            console.log(err);
            res.redirect("/exhibitions");
        } else {
           //create new comment
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Something went wrong");
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   // add username and ID to comment
                   comment.save();
                   // save comment
                   exhibition.comments.push(comment);
                   exhibition.save();
                //   console.log(comment);
                   res.redirect("/exhibitions/" + exhibition._id);
               }
           });
        }
    });
});

// comments edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else {
           res.render("comments/edit", {exhibition_id: req.params.id, comment: foundComment}); 
        }
    });
});

// COMMENTS UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // console.log(req.comment_id);
    Comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.comment, {new:true}, function(err, updatedComment){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully updated");
            res.redirect("/exhibitions/" + req.params.id);
        }
    });
});

// Comment Destroy route

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findOneAndDelete({_id: req.params.comment_id}, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            req.flash("success", "Successfully removed your comment");
            res.redirect("/exhibitions/" + req.params.id);
        }
    });
});


module.exports = router;

