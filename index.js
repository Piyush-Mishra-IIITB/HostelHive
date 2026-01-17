const express=require("express");
const app=express();
const port=8080;
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hostelhive');
}
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
main()
.then((res)=>{
   console.log("connected to mongoDb");
})
.catch((err)=>{
    console.log(err);
});
app.listen(port,()=>{
    console.log("hiii");
});
app.get("/",(req,res)=>{
    res.send("hii");
});
//show route
app.get("/listings",async (req,res)=>{
   let posts=await Listing.find({});
   res.render("home",{posts});
});

app.get("/listings/:id",async (req,res)=>{
    console.log("hii");
    let {id}=req.params;
     let post=await Listing.findById(id);
     console.log(post);
    res.render("show",{post});
});