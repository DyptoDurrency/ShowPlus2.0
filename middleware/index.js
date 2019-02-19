// all the middleware goes here
var Exhibition = require("../models/exhibition");
var Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.checkExhibitionOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        
        Exhibition.findById(req.params.id, function(err, foundExhibition){
            if(err || !foundExhibition){
              console.log(err);
              req.flash('error', 'Sorry, that exhibition does not exist!');
              res.redirect('/exhibitions');
            } else {
                
                // if yes, own exhibition? or redirect
                if(foundExhibition.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                   console.log(err);
                   req.flash('error', 'Sorry, that comment does not exist!');
                   res.redirect('/exhibitions');
                } else {
                // if yes, own comment? or redirect
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn= function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;