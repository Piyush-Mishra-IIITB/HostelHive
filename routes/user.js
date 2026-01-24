const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {redirectURL}= require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to HostelHive!");
      res.redirect("/listings");
    });
  })
);
router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post(redirectURL,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),
    async (req,res)=>{
    req.flash("success","Welcome back to HostelHive!");
    let redirectURL=res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","you are logged out!");
            res.redirect("/listings");
        }
    })
})
module.exports=router;