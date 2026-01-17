const mongoose=require("mongoose");
const data=require("./init.js");
const Listing=require("../models/listing.js");
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hostelhive');
}

main()
.then((res)=>{
   console.log("connected to mongoDb");
})
.catch((err)=>{
    console.log(err);
});

const initDB=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("initial data was saved");
};

initDB();