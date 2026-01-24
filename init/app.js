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

const initDB = async () => {
  await Listing.deleteMany({});

  const seededData = data.map(obj => ({
    ...obj,
    owner: [new mongoose.Types.ObjectId("6971918d8f9e50a0455e1f67")],
    category: obj.category || "trending", 
  }));

  await Listing.insertMany(seededData);
  console.log("✅ Initial data was saved");
};

initDB();