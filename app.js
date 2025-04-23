if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("./schema.js");
const listingsRoute=require("./routes/listing.js");
const reviewsRoute=require("./routes/reviews.js");



const userRoute=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",ejsMate);
let mongooseUrl="mongodb:127.0.0.1:27017/wanderland";

let atlasUrl=process.env.db_URL;
const mongoose=require("mongoose");

async function main(){
    await mongoose.connect(atlasUrl);
};
main()
.then(()=>{
    console.log("Dbs Working");
}).catch((err)=>{
    console.log(err);
});



const store=MongoStore.create({
    mongoUrl:atlasUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
const sessionOption=({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
});
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
app.get("/",(req,res)=>{
    res.send("Working");
});

// app.get("/demouser", async(req,res)=>{
//     let fakeUser= new User({
//         email:"new@gmail.com",
//         username:"Usermarsh",
//     });
//     let newUser=await User.register(fakeUser,"helloworld");
//     res.send(newUser);
// })

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute); 
app.use("/",userRoute);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not found"));
})
app.use((err,req,res,next)=>{

    let{statusCode=500 ,message="Something went wrong"}=err;


    res.status(statusCode).render("error.ejs",{message});

})
app.listen(8000,()=>{
    console.log("Listening server 8000");
});