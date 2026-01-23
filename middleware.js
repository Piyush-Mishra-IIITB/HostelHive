const Listing=require("./models/listing");
module.exports.isLoggedIn=(req,res,next)=>{

 if(!req.isAuthenticated()){
    req.session.redirectURL=req.originalUrl;
  req.flash("error","you need to login first");
  res.redirect("/login");
  }else{

    next();
  }
}
module.exports.redirectURL=(req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL=req.session.redirectURL;
    }
    next();
}


module.exports.isOwner=async (req,res,next)=>{
    let {id} =req.params;
    let listing=await Listing.findById(id);
    if( ! listing.owner[0]._id.equals(res.locals.CurrentUser._id)){
          req.flash("error","you don't have permission to do this");
         return res.redirect(`/listings/${id}`);
       }
    next();
}