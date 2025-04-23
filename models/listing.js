const mongoose=require("mongoose");
const Review=require("./review.js");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
    
    },
    description:{
        type:String
    },
    image:{
        filename:String,
        url:String,
       
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    category:{
        type:{
            type:String,
            enum:["trending"]
        }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})


const Listing=new mongoose.model("Listing",listingSchema);

module.exports=Listing;