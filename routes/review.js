const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema} =require("../schema.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
 else{
  next();
}};
 
router.post("/",validateReview,wrapAsync(async (req,res)=>{
        let {id}=req.params;
        let newReview =new Review(req.body.review);
        let listing=await Listing.findById(id);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success","Review Added!")
        res.redirect(`/listings/${id}`);
}));

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}));
module.exports=router;