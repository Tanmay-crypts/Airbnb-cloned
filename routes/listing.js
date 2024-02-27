const express = require("express")
const router = express.Router();
const { listingSchema, revSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError")
const wrapAsync = require("../utils/wrapAsync")
const Listing = require("../models/listing.js")
const { isLogged } = require("../middleware")
const{isOwner}= require("../middleware")

const valSchema = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

router.get("/", async (req, res) => {
    const list = await Listing.find({});
    res.render('./listings/index.ejs', { list: list });
})

router.get("/new", (req, res) => {
    res.render('listings/new.ejs')
})

router.get("/:id", wrapAsync(async (req, res) => {   //anything after /listings
    let { id } = req.params;
    const list = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!list) {
        req.flash("error", "Listing you requested does not exist!")
        res.redirect("/listings")
    }
    res.render('./listings/show.ejs', { list })
}));

//Create
router.post("/", valSchema, wrapAsync(async (req, res) => {
    const newList = new Listing(req.body.listing);
    newList.owner=req.user._id;
    await newList.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings")
}))

router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    res.render('./listings/edit.ejs', { list })
})
//update
router.put("/:id", valSchema,isLogged, isOwner, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });    //all updated
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
})
router.delete('/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing removed");
    res.redirect('/listings/');
})

module.exports = router;