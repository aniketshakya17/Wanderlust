const express=require("express");
const app=express();

// const cookieParser=require("cookie-parser");
// app.use(cookieParser("secretcode"));


const path=require("path");

const flash=require("connect-flash");
const session=require("express-session");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const sessionOpions=({
    secret:"mysupersecretstrings",
    resave:false,
    saveUninitialized:true,
});
app.use(session(sessionOpions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successmessges=req.flash("success");
    res.locals.errormessges=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;   
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","not registered");
    }else{
        req.flash("success","user registered successfully!");
    }
   
    res.redirect("/hello");
});
app.get("/hello",(req,res)=>{
    // console.log(req.flash("success"));
   
    res.render("hello.ejs",{name: req.session.name});
});


// app.get("/hello",(req,res)=>{
//     res.send(`hello ${req.session.name}`);
// });

// app.get("/sessioncount",(req,res)=>{

//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
   
//     res.send(`Session Count is ${req.session.count}`);
// })






// app.get("/setcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("origin","india");
//     res.send("Working well");
// })


// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Root working");
// })

// app.get("/greet",(req,res)=>{
//     let{name="random"}=req.cookies;
//     res.send(`Hi ${name}`);
// })
// app.get("/signedcookie",(req,res)=>{
//     res.cookie("color","red",{signed:true});
//     res.send("Cookie signed");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })
app.listen(3000,()=>{
    console.log("Listening server 3000");
})