const mongoose= require("mongoose")
const express =require("express")
const path=require('path')
const app= express();
const meth=require('method-override')
const ejsmate=require('ejs-mate')
const ExpressError=require("./utils/ExpressError")
const listings= require("./routes/listing")
const reviews= require("./routes/review")
const userRouter= require("./routes/user")
const session =require("express-session")
const flash=require("connect-flash");
const passport = require("passport");
const localPassport= require("passport-local")
const User= require("./models/user")

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));
app.use(meth('_method'))
app.engine('ejs',ejsmate);
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))

async function main(){
    await mongoose.connect(MONGO_URL)
}
main().then(()=>{
    console.log('success');
}).catch(err => console.log(err))

const options={
    secret:"secretcode",
    resave:false,
    saveUninitialized: true,
    cookie:{
        // expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true, //default true
    }
};

app.use(session(options));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localPassport(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=> {
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curr=req.user;
    next()
})
    
app.use("/listings",listings);
app.use("/listings/:id/",reviews);
app.use("/",userRouter);

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})
app.listen(8080,()=>{
    console.log("listening at 8080");
})
// //     let sample=new Listing({
// //         title: "My New Villa",
// //         description:"By the beach",
// //         price:"1200",
// //         location: "Calangute,Goa",
// //         country: 'India'
// //     });
// //     await sample.save();
// //     res.send("success")
// // });

// cards manager
// password mamnager
// battery full
// ui of moneycontrol
// email manager