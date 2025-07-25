import mongoose from "mongoose";

const packageSchema= new mongoose.Schema({
    packageId:{
        type:String,
        required:true,
        unique:true
    },
     consumerEmail:{
        type:String,
        required:true,
     },
     city:{
        type:String,
        required:true
     },
     eventTimeStamp:{
        type:String,
        required:true
     },
     receivedAt:{
        type:String,
        required:true
     },
    productDesc:{ 
        type:String, 
        required:true
    },
    price:{
        type:String,
        required:true
    },
    productImage:[{
           type:Array
      }],
    status:{
        type:String,
        enum:["CREATED","PICKED_UP","IN_TRANSIT","OUT_FOR_DELIVERY","DELIVERED","EXCEPTION","CANCELLED"],
        default:"CREATED"
    }
},
    
{
    timestamps:true
    //These will give data of the time of creation and the time of update.
}
)

const Package = mongoose.model('Package',packageSchema)

export default Package;