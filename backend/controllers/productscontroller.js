const Product =require('../models/productmodel');
const ErrorHandler=require('../utils/errorhandler');
const catchasyncerror =require('../middlewares/catchasyncerror');
const ApiFeatures = require('../utils/apifeatures');

exports.getProducts =catchasyncerror( async(req, res, next) => {
    const resperpage = 2;
    const apifeatures = new ApiFeatures(Product.find(),req.query)
        .search()
        .filter()
        .paginate(resperpage);
        const products =await apifeatures.query;
    res.status(200).json({
        success: true,
        count:products.length,
        products,
      
    });
});

exports.newproduct = catchasyncerror(async(req,res,next)=>{
    req.body.user = req.user.id;
    const product = await  Product.create(req.body);
         res.status(201).json({
            success:true,
            product,
         })
});

exports.getsingleproduct =catchasyncerror(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next( new ErrorHandler('product not found',404));
    }
    res.status(200).json({
        success: true,
        product
    });
});
exports.updateproduct =async(req,res,next)=>{
   let product=  await Product.findById(req.params.id);

   if(!product){
    res.status(404).json({
        success:false,
        message:"product  no found"
    });
    }
   product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators:true

    })
 res.status(200).json({
    success:true,
    product
 })

}
exports.deleteproduct =async(req,res,next)=>{
    let product=  await Product.findById(req.params.id);
 
    if(!product){
     res.status(404).json({
         success:false,
         message:"product  no found"
     });
     }
    product = await Product.findByIdAndDelete(req.params.id,req.body)
  res.status(200).json({
     success:true,
     message:"deleted"
  })
 
 }

 //create review - api/review
 exports.createreview =catchasyncerror(async(req,res,next)=>{
    const{
        productid,
        rating,
        comment
    }=req.body;

    const review ={
        user:req.user.id,
        rating,
        comment

    }
    const product =await Product.findById(productid);

    //find user already reviews
     const isreviewed =product.reviews.find(review =>{
      return  review.user.toString()  ==req.user.id.toString()
    })

    if(isreviewed){
        //updating the review
        product.reviews.forEach(review =>{
            if(review.user.toString() ==req.user.id.toString()){
                review.comment = comment
                review.rating = rating 
            }
        })
    }else{
        //creating the review
        product.reviews.push(review);
        product.numOfReviews =product.reviews.length;
    }

    //finding avg of the product reviews
    product.ratings= product.reviews.reduce((acc,review) => {
        return review.rating + acc;
    },0)/ product.reviews.length;
    product.ratings = isNaN(product.ratings)?0:product.ratings

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        sucess:true,
    })
 })

 //get reviews =api/reviews?id={productid}

 exports.getreviews = catchasyncerror(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    res.status(200).json({
        sucess:true,
        reviews:product.reviews
    })

 })

 //delete reviews = api/review
 exports.deletereviews =catchasyncerror(async(req,res,next)=>{
    const product = await Product.findById(req.query.productid);
    
    //filteriung the reviews which does not match the delete review
    const reviews = product.reviews.filter(review =>{
       return  review._id.toString() !==req.query.id.toString();
    });
    
    //number of revw=iews
     const numOfReviews =reviews.length;
     
    // find avg
    let ratings =reviews.reduce((acc,review) => {
        return review.rating + acc;
    },0)/ reviews.length;
    
    //saving 
    ratings=isNaN(ratings)?0:ratings;
    await Product.findByIdAndUpdate(req.query.productid,{
        reviews,
        numOfReviews,
        ratings
    })
    res.status(200).json({
        sucess:true
    })

    })
