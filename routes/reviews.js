const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const{reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }  
};

//Review add

router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.reviews);
    await listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review added successfully");
    console.log("review saved successfully");
    res.redirect(`/listings/${listing.id}`);

}));

// Review Delete

router.delete("/:reviewId",async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted Successfully");
    res.redirect(`/listings/${id}`);
});

module.exports=router;
