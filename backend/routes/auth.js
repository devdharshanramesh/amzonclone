// routes/auth.js
const express = require('express');
const { 
     registeruser,
     loginUser, 
     logoutuser,
     forgotpassword,
     resetpassword, 
     getuserprofile, 
     changepassword, 
     updateprofile,
     getallusers,
     getuser,
     updateuser,
     deleteuser} = require('../controllers/authcontroller');
const { isauthenticateuser, authorizeroles } = require('../middlewares/authenticate');

const router = express.Router();

router.route('/register').post(registeruser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutuser);
router.route('/password/forget').post(forgotpassword);
router.route('/password/reset/:token').post(resetpassword);
router.route('/myprofile').get(isauthenticateuser,getuserprofile);
router.route('/password/change').put(isauthenticateuser,changepassword);
router.route('/update').put(isauthenticateuser,updateprofile);


//adminroutes

router.route('/admin/users').get(isauthenticateuser,authorizeroles('admin'),getallusers);
router.route('/admin/user/:id').get(isauthenticateuser,authorizeroles('admin'),getuser);
router.route('/admin/user/:id').put(isauthenticateuser,authorizeroles('admin'),updateuser);
router.route('/admin/user/:id').delete(isauthenticateuser,authorizeroles('admin'),deleteuser);




module.exports = router;
