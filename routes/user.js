const express = require("express")
const router = express.Router();
const ExpressError = require("../utils/ExpressError")
const wrapAsync = require("../utils/wrapAsync")
const User = require("../models/user.js")
const passport = require("passport");
const { saveUrl } = require("../middleware");

router.route("/signup")
    .get((req, res) => {
        res.render('users/signup.ejs')
    })
    .post(async (req, res) => {
        try {
            let { username, email, password } = req.body;
            let newUser = new User({ username, email });
            const reg = await User.register(newUser, password);
            req.login(reg,(e)=>{
                if(e) return next(e);
                req.flash("success", "Welcome to Airbnb")
                res.redirect("/listings")
            })
        } catch (e) {
            req.flash("error", e.message)
            res.redirect("/signup")
        }
    })
router.route("/login")
    .get((req, res) => {
        res.render('users/login.ejs')
    })
    .post(saveUrl,
        passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), async (req, res) => {
        req.flash("success", "Welcome back!")
        let url= res.locals.redirectUrl || '/listings';
        res.redirect(url);
    })
router.get("/logout", (req, res, next) => {     //post or delete
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success","Have a good vacation!")
        res.redirect("/listings")
    })
})

module.exports = router;