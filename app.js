var  express               =require("express"),
     bodyParser            =require("body-parser"),
     mongoose              =require("mongoose"),
     passport              =require("passport"),
     Campground            =require("./models/campground.js"),
     User                  =require("./models/user")
     localStrategy         =require("passport-local"),
     passportLocalmongoose =require("passport-local-mongoose")
 

var app =express();
app.use(require("express-session")({
    secret:"vineet will be successful in his life",
    resave:false,
    saveUninitialized:false
}))

mongoose.connect("mongodb://localhost/yelp_v4",{ useNewUrlParser: true,useUnifiedTopology: true  });    
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/*Campground.create({
    name:"Riverside",
    image:"https://pixabay.com/get/54e2d5434f5ab108f5d084609620367d1c3ed9e04e507441742c7bdc9645c1_340.jpg",
    description:"This is riverside campground and its damn good"
},function(err,Campground){
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("newly Created campground");
        console.log(Campground); 
    }
});*/ 

app.set("view engine","ejs");
app.get("/",function(req,res){
    res.render("landing");
})
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{campgrounds:allcampgrounds});
        }
    })
});

app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var newCampground={name:name,image:image,description:desc};
   Campground.create(newCampground,function(err,newlyCampground){
        if (err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    })
})
app.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("new");
})
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if (err)
        {
            console.log(err);
        }
        else{
            res.render("show",{Campground:foundCampground});
        }
    })
   
})

//authentication routes
//register routes
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log("err");
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })
    })
})
//login
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/"
}),function(req,res){

})

//logout
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/");
   })


//function
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/")
}

app.listen(2000,function(){
    console.log("Yelpcamp server has started");
})