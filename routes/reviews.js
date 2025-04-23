const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

const {loggedin,validateReview,isReviewAuthor,saveRedirectUrl}=require("../middleware.js");

const reviewListing=require("../controllers/review.js");

//Review add

router.post("/",loggedin,validateReview,wrapAsync(reviewListing.createReview));

// Review Delete

router.delete("/:reviewId",loggedin,saveRedirectUrl,isReviewAuthor,reviewListing.destroyReview);

module.exports=router;
