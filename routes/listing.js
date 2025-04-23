const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {saveRedirectUrl}=require("../middleware.js");
const multer  = require('multer');

const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })
const{loggedin,isOwner,validatelisting}=require("../middleware.js");

const listingControler=require("../controllers/listing.js");


//Indx Route
//Add newListing

router.route("/")
.get(wrapAsync(listingControler.index))
.post( loggedin, upload.single('listing[image]'),validatelisting,wrapAsync(listingControler.addNewListing));





//New Route
router.get("/new",loggedin,listingControler.newFormRender);

//Show route
//Update route
//Delete route


router.route("/:id")

.get(wrapAsync(listingControler.showListing))
.patch(isOwner,loggedin,upload.single('listing[image]'),validatelisting,wrapAsync(listingControler.updateListing))
.delete(isOwner,loggedin,wrapAsync(listingControler.destroyListing));

//Edit route
router.get("/:id/edit", loggedin,wrapAsync(listingControler.editListing));






module.exports= router;