const express = require("express")
const router = express.Router({mergeParams: true});
const {
    listingSchema,
    revSchema
} = require("../schema")
const Listing= require("../models/listing.js")
const ExpressError = require("../utils/ExpressError")
const wrapAsync = require("../utils/wrapAsync")
const Review = require("../models/review.js")
const { isLogged , isAuthor} = require("../middleware")

const valSchema=(req,res,next)=>{
    let {error}= revSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg); 
    } else{
        next();
    }
}

router.route('/reviews')
.post(isLogged,valSchema, async (req, res) => {
    let {id} = req.params;
    let list = await Listing.findById(id);
    let rev = new Review(req.body.review);
    rev.author=req.user._id;
    list.reviews.push(rev);
    await rev.save();
    await list.save();
    req.flash("success", "New Review created");
    res.redirect(`/listings/${id}`);
})

router.delete("/reviews/:revid",isLogged, isAuthor,wrapAsync(async (req,res)=> {
    let {id, revid} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid} });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review removed");
    res.redirect(`/listings/${id}`);
}));
module.exports= router;