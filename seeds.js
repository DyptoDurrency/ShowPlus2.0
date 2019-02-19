var mongoose = require("mongoose");
var Exhibition = require("./models/exhibition");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "ABCI conference", 
        image: "http://showplus.com.au/uploads/editor/201511318332128889.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Australia Imports & Exports", 
        image: "http://showplus.com.au/uploads/editor/20151131832526849.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "Good Wine & Food Show", 
        image: "http://showplus.com.au/uploads/editor/201511318273948068.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id: "588c2e092403d111454fff77",
            username: "Jane"
        }
    }
];
 
function seedDB(){
   //Remove all exhibitions
   Exhibition.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed exhibitions!");
        Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few exhibitions
            data.forEach(function(seed){
                Exhibition.create(seed, function(err, exhibition){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added an exhibition");
                        //create a comment
                        Comment.create(
                            {
                                text: "Great and friendly agent, really made my tax return easy and I got the $$ quickly",
                                author: {
                                    id: "588c2e092403d111454fff76",
                                    username: "Ray"
                                }
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    exhibition.comments.push(comment);
                                    exhibition.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
}
 
module.exports = seedDB;