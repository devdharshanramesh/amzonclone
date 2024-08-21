const express = require('express');
const { getProducts, newproduct, getsingleproduct, updateproduct, deleteproduct, createreview, getreviews, deletereviews } = require('../controllers/productscontroller'); // Ensure the name matches the export
const router = express.Router();
const {isauthenticateuser, authorizeroles }=require('../middlewares/authenticate')

// Define route and associate with the controller function
router.route('/products').get(isauthenticateuser,getProducts);
router.route('/products/:id').get(getsingleproduct)
                            .put(updateproduct)
                            .delete(deleteproduct);
router.route('/review').put(isauthenticateuser,createreview);
router.route('/reviews').get(isauthenticateuser,getreviews);
router.route('/review').delete(isauthenticateuser,deletereviews);
//admin routes 
router.route('/admin/products/new').post(isauthenticateuser,authorizeroles('admin'),newproduct);

















































module.exports = router;
