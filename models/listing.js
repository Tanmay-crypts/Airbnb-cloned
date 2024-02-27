const mongoose=require("mongoose")
const schema=mongoose.Schema

const listSchema= new schema({
    title: {
    type: String,
    required: true
    },
    description:String,
    image: {
        type:String,
        default:'https://images.unsplash.com/photo-1685514823717-7e1ff6ee0563?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80',
        set: (v) => v===''
        ? 'https://images.unsplash.com/photo-1685514823717-7e1ff6ee0563?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80'
        :v,
    },
    price:Number,
    location:String,
    country: String,
    reviews:[{
        type: schema.Types.ObjectId,
        ref:"review"
    }],
    owner:{
        type:schema.Types.ObjectId,
        ref:"User"
    }
})

const Listing =mongoose.model("Listing",listSchema)
module.exports= Listing;