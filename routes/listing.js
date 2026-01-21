const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema} =require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
 else{
  next();
}};

router.get("/",wrapAsync(async (req,res)=>{
   let posts=await Listing.find({});
   res.render("listings/home",{posts});
}));
router.get("/new",(req,res)=>{
     res.render("listings/new");
});
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid data");
    }
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
    
}));
router.get("/:id",wrapAsync(async (req,res)=>{
    console.log("hii");
    let {id}=req.params;
     let post=await Listing.findById(id).populate("reviews");
     if(!post){
      req.flash("error","Your Listing does not exist");
      return res.redirect("/listings");
     }
    res.render("listings/show",{post});
}));

router.get("/:id/edit", wrapAsync(async (req,res)=>{
    let {id}=req.params;
   const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
}));
router.patch("/:id",validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    if (!req.body.listing.image?.url) {
    delete req.body.listing.image;
  }
    await Listing.findByIdAndUpdate(id,req.body.listing,{runValidators:true});
    req.flash("success","Listing Updated!")
    res.redirect("/listings");
}));
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}));

module.exports=router;