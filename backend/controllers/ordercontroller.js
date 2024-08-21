const { defaultConfiguration } = require("../app");
const catchasyncerror = require("../middlewares/catchasyncerror");
const Order =require('../models/order');
const Product = require('../models/productmodel')
const ErrorHandler = require("../utils/errorhandler");

//createneworder =api/order/new
exports.neworder =catchasyncerror(async(req,res,next)=>{
    const {
        orderitems,
        itemsprice,
        taxprice,
        shippingprice,
        totalprice,
        shippinginfo,
        paymentinfo
    }=req.body;

    const order = await Order.create({
        
        orderitems,
        itemsprice,
        taxprice,
        shippingprice,
        totalprice,
        shippinginfo,
        paymentinfo,
        paidat: Date.now(),
        user:req.user.id

    })
    res.status(200).json({
        success:true,
        order

    })
})
//get single order -/api/order/id
exports.getsingleorder =catchasyncerror(async(req,res,next)=>{
     const order = await Order.findById(req.params.id).populate('user','name email');
  
  if(!order){
    return next(new ErrorHandler(`order is not found with this id:${req.params.id} `,404))
  }

  res.status(200).json({
     success:true,
     order
  })

})

//get logined user orders -api/myorders
exports.myorders = catchasyncerror(async(req,res,next) =>
    {
         const order = await Order.find({user:req.user.id});

         res.status(200).json({
            success:true,
            order
         })
    
})

//admin : get all orders =api/orders

exports.orders =catchasyncerror(async(req,res,next) =>
    {
         const orders = await Order.find();
         let totalamount =0

         orders.forEach(order =>{
            totalamount +=order.totalprice
         }
         )

         res.status(200).json({
            success:true,
            totalamount,
            orders,
         })
    
})

//admin ;update order -api/order/:id

exports.updateorder =catchasyncerror(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(order.orderstatus == 'Delivered'){
        return next(new ErrorHandler('order has been already deleivered'))
    }
    //updating the stock of the eacg order item
    order.orderitems.forEach( async orderitem =>{
       await  updatestock(orderitem.product,orderitem.quantity)
    })

    order.orderstatus =req.body.orderstatus;
    order.deliveredat =Date.now();
    await order.save();
    res.status(200).json({
        success:true,

    })


});
async function updatestock(productid,quantity){
    const product =await Product.findById(productid);
    product.stock =product.stock - quantity;
    product.save({validateBeforeSave:false})
}

//admin: delete order -api/order/:id
exports.deleteorder =catchasyncerror(async(req,res,next)=>{
  const order = await Order.findById(req.params.id);
 if(!order){
     return next(new ErrorHandler('order not found '),404)
 }
  await order.deleteOne();
  res.status(200).json({
    success:true
  })


})