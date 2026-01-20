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
const listings=require("./routes/listing.js");
const path=require("path");
const {listingSchema,reviewSchema} =require("./schema.js");
const Review=require("./models/review.js");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const listing = require("./models/listing.js");
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
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
 else{
  next();
}};

app.use("/listings",listings);

// reviews
app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
        let {id}=req.params;
        let newReview =new Review(req.body.review);
        let listing=await Listing.findById(id);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message, statusCode: status });
});
