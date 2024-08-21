const app = require('./app');
const dotenv =require('dotenv');
const connectDatabase = require('./config/database');
const path=require('path');




dotenv.config({path:path.join(__dirname,"config/config.env")});

connectDatabase();

const server =app.listen(process.env.PORT,()=>{
    console.log(`server listencl : ${process.env.PORT} in ${process.env.NODE_ENV}`);
})
process.on('unhandledRejection',(err)=>{
    console.log(`error: ${err.message}`);
    console.log('shuttiing down due to unhandles error');
    server.close(()=>{
        process.exit(1);
    });
})



process.on('uncaughtException',(err)=>{
    console.log(`error: ${err.message}`);
    console.log('shutiing down due to uncught error');
    server.close(()=>{
        process.exit(1);
    });

})
