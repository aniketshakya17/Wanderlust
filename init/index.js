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
    await Listing.insertMany(initData.data);
    console.log("Datasaved intialiazed");
};

initDB();

