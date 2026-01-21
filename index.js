const express=require("express");
const app=express();
const port=8080;
const mongoose = require('mongoose');
const flash=require("connect-flash");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hostelhive');
}
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const path=require("path");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");

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
const secreOption={
secret:"mysupersecretcode",
resave:false, 
saveUninitialized:true,
cookie:{
  expires:new Date(Date.now()+ 7*24*60*60*1000),
  maxAge:7*24*60*60*1000,
  httpOnly:true,
},
};
app.use(session(secreOption));
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
});
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
  
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message, statusCode: status });
});
