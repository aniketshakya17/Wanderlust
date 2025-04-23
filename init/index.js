const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderland");
};
main()
.then(()=>{
    console.log("Dbs Working");
}).catch((err)=>{
    console.log(err);
});


const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67f8f19036d4154b7ea6f1d6"}));
    await Listing.insertMany(initData.data);
   
    console.log("Datasaved intialiazed");
};

initDB();

