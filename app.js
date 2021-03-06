
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Exhibition = require("./models/exhibition"),
    seedDB = require("./seeds"),
    User = require("./models/user"),
    // jquery = require("jquery"),
    // popperjs = require("popper.js"),
    // bootstrap = require("bootstrap"),
    Comment = require("./models/comment");

// requiring routes
var commentRoutes       = require("./routes/comments"),
    exhibitionRoutes    = require("./routes/exhibitions"),
    indexRoutes         = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12Deployed";
// mongoose.connect("mongodb+srv://DyptoDurrency:Testtest!1@cluster0-rayah.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });
mongoose.connect(url, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

// Seed the database, uncomment after initial seeding for persistence
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "You're so vain. You probably think this song is about you.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/exhibitions/:id/comments", commentRoutes);
app.use("/exhibitions", exhibitionRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The ShowPlus server has started!");
});