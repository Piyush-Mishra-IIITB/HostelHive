const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60"
          : v,
    },
    filename: {
      type: String,
      default: "listingimage",
    },
  },

  price: Number,
  location: String,
  country: String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  },],
  owner:[{
    type:Schema.Types.ObjectId,
    ref:"User",
  },],
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    review.deleteMany({_id:{$in:listing.reviews}});
  }
});
module.exports = mongoose.model("Listing", listingSchema);
