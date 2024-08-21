const products = require('../data/products.json');
const Product = require('../models/productmodel');
const connectDatabase = require('../config/database');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../config/config.env') });

connectDatabase();

const seedProducts = async ()=>{
    try{    
        await Product.deleteMany();
        console.log('Products deleted!')
        await Product.insertMany(products);
        console.log('All products added!');
    }catch(error){
        console.log(error.message);
    }
    process.exit();
}

seedProducts();