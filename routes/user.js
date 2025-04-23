const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const User=require("../models/user.js");
const {saveRedirectUrl}=require("../middleware.js");
const client=require("../controllers/users.js");

//signupRender
//signup
router.route("/signup")
.get(client.renderSignup)
.post(wrapAsync(client.signUp));

//loginRender
//login
router.route("/login")
.get(client.renderLogin)
.post(saveRedirectUrl,passport.authenticate ("local",{failureRedirect:"/login",failureFlash:true,}),client.login);

//logout
router.get("/logout",client.logout);

module.exports=router;