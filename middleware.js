const Listing = require("./models/listing.js")
const review = require("./models/review")

module.exports.isLogged = (req, res) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "Login first!")
        return res.redirect("/login")
    }
}
module.exports.saveUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}
module.exports.isOwner = async (req, res,next) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list.owner.equals(res.locals.curr._id)) {
        req.flash("error", "Not authorised!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}
module.exports.isAuthor = async (req, res,next) => {
    let {id, revid } = req.params;
    let rev = await review.findById(revid);
    if (!rev.author.equals(res.locals.curr._id)) {
        req.flash("error", "Not authorised!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}
