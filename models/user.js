const mongoose=require("mongoose")
const schema=mongoose.Schema
const localPassport= require("passport-local-mongoose")


const userSchema= new schema({
    email: {
    type: String,
    required: true
    },
})
userSchema.plugin(localPassport);
module.exports= mongoose.model("User",userSchema);