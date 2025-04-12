const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const{listingSchema}=require("../schema.js");

const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }  
};




router.get("/new",(req,res)=>{
    
    res.render("./listings/new.ejs");
});
    


router.get("/",wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing does not exsists");
       return res.redirect("/listings");
    }
    res.render("./listings/watch.ejs",{listing});
}));

router.post("/", validatelisting, wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();

        req.flash("success","Listings Created Successfully");
        console.log(newListing);
        res.redirect("/listings"); 

}));


router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);  
    if(!listing){
        req.flash("error","Listing does not exsists");
        res.redirect("/listings");
    } 
    res.render("./listings/edit.ejs",{listing});

}));

router.patch("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let body=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated successfully");
    console.log(body);
    res.redirect(`/listings/${id}`);
}));


router.delete("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted successfully");
    res.redirect("/listings");
}));

module.exports= router;