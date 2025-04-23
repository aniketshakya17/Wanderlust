const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.reviews);
    newReview.author=req.user._id;
    await listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review added successfully");
    console.log("review saved successfully");
    res.redirect(`/listings/${listing.id}`);

};

module.exports.destroyReview=async(req,res)=>{
    console.log(req.user);
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted Successfully");
    let redirectUrl=res.locals.redirect||`/listings/${id}`;
    res.redirect(redirectUrl);
};