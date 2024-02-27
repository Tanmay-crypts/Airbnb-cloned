const initData =require("./data.js")
const mongoose=require('mongoose')
const Listing=require('../models/listing.js')

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}
main().then(()=>{
    console.log('success');
})
const initDB = async()=>{
    await Listing.deleteMany()
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"65a5258d5b6d36a36c8d7503"
    }))
    await Listing.insertMany(initData.data)
    console.log('success init');
}
initDB();