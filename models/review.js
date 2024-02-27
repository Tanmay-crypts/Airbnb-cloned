const mongoose=require("mongoose")
const schema=mongoose.Schema

const revSchema=new schema({
    comment: String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created:{
        type: Date,
        default: Date.now()
    },
    author:{
        type:schema.Types.ObjectId,
        ref:"User"
    }
});
module.exports=mongoose.model("review",revSchema);