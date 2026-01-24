const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

router.route("/")
.get(wrapAsync(async (req, res) => {
  let posts = await Listing.find({});
  res.render("listings/home", { posts,selectedCategory: null });
}))
.post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(async (req, res) => {

    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid data");
    }

    const newListing = new Listing(req.body.listing);

    if (typeof req.file!=="undefined") {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings");
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});
router.get("/search",async (req,res)=>{
  let{location}=req.query;
  if (!location || location.trim() === "") {
    return res.redirect("/listings");
  }
  const regex=new RegExp(location,"i");
  const AllListings=await Listing.find({location:regex});
  res.render("listings/searched.ejs",{AllListings,location });
});
router.get("/category",async (req,res)=>{
  let {category}=req.query;
  if (!category) {
    return res.redirect("/listings");
  }
  const allListings=await Listing.find({category});
  res.render("listings/category.ejs",{allListings,selectedCategory:category});
});
router.route("/:id")
.get(wrapAsync(async (req, res) => {
  let { id } = req.params;
  let post = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!post) {
    req.flash("error", "Your Listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show", { post });
}))
.patch(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(async (req, res) => {

    let listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body.listing,
      { new: true, runValidators: true }
    );

    if (typeof req.file!=="undefined") {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
      await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${listing._id}`);
  })
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
}));

module.exports = router;
