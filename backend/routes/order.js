const express =require('express');
const { neworder, getsingleorder, myorders, orders, updateorder, deleteorder } = require('../controllers/ordercontroller');

const router = express.Router();
const { isauthenticateuser, authorizeroles } = require('../middlewares/authenticate');



router.route('/order/new').post(isauthenticateuser,neworder);
router.route('/order/:id').get(isauthenticateuser,getsingleorder);
router.route('/myorders').get(isauthenticateuser,myorders);

//admin
router.route('/orders').get(isauthenticateuser,authorizeroles('admin'),orders);
router.route('/order/:id').put(isauthenticateuser,authorizeroles('admin'),updateorder);
router.route('/order/:id').delete(isauthenticateuser,authorizeroles('admin'),deleteorder);

module.exports =router;