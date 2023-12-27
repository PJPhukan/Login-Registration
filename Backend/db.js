const mongoose=require('mongoose');
const mongoUrl ="mongodb://127.0.0.1:27017/Registration";
const MongoToConnect=()=>{
    mongoose.connect(mongoUrl).then(()=>{
        console.log("Connection Succesfull");
    }).catch(()=>{
        console.log("Connection Faild");
    })
}

module.exports=MongoToConnect;
