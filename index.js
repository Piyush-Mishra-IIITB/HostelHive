const express=require("express");
const app=express();
const port=8080;
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hostelhive');
}
const path=require("path");
const {listingSchema} =require("./schema.js");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs',ejsMate);
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
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
 else{
  next();
}};

app.get("/listings",wrapAsync(async (req,res)=>{
   let posts=await Listing.find({});
   res.render("listings/home",{posts});
}));
app.get("/listings/new",(req,res)=>{
     res.render("listings/new");
});
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid data");
    }
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
}));
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    console.log("hii");
    let {id}=req.params;
     let post=await Listing.findById(id);
     console.log(post);
    res.render("listings/show",{post});
}));

app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id}=req.params;
   const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
}));
app.patch("/listings/:id",validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    if (!req.body.listing.image?.url) {
    delete req.body.listing.image;
  }
    await Listing.findByIdAndUpdate(id,req.body.listing,{runValidators:true});
    res.redirect("/listings");
}));
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message, statusCode: status });
});
