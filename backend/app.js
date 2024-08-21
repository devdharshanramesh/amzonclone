const express =require('express');
const app =express();
const errormiddleware=require('./middlewares/error');
const cookieparser =require('cookie-parser');

app.use(express.json());
app.use(cookieparser());

const products =require('./routes/product');
const auth = require('./routes/auth');
const order =require('./routes/order');

app.use('/api',products);

app.use('/api',auth);
app.use('/api',order)

app.use(errormiddleware);

module.exports =app;