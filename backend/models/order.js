const mongoose = require('mongoose');

const orderschema = mongoose.Schema({
    shippinginfo:{
        address:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        phonenumber:{
            type:String,
            required:true
        },
        postalcode:{
            type:String,
            required:true
        }

    },
    user:{
        type :mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:'User'
    },
    orderitems:[{
        name:{
            type:String,
            required:true
        },
        quantity:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        product:{
            type:mongoose.SchemaTypes.ObjectId,
            required:true,
            ref:'Product'
        }

    }],
    itemsprice:{
            type:Number,
            required:true,
            default:0.0
    },
    taxprice:{
        type:Number,
        required:true,
        default:0.0
    },
    shippingprice:{
        type:Number,
        required:true,
        default:0.0
    },
    totalprice:{
        type:Number,
        required:true,
        default:0.0
    },
    paidAt:{
        type:Date
    },
    deliveredAt:{
        type:Date
    },
    orderstatus:{
        type:String,
        required:true,
        default:'processing'
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
       

})

let ordermodel= mongoose.model('order',orderschema)

module.exports=ordermodel;