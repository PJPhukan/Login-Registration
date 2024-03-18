const mongoose = require('mongoose')
const { Schema } = mongoose;


//create data schema

const dataSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    type: {
        type: File
    },
    description: {
        type: String,
    }

})

const Data = mongoose.model('LoginRegistrationData', dataSchema);
module.exports = Data;