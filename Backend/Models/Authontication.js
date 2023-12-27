const mongoose=require('mongoose');
const {Schema}=mongoose;
//create user schema

const userSchema=new Schema({
    name:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user', userSchema);
module.exports=User;
