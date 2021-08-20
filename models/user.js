//creating user schema

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;             //just a datatype to give it to an entiity in schema

const userSchema = new mongoose.Schema({        //creating user schema
    name : {
          type : String,
          required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    pic : {
       type : String,
       default : "https://res.cloudinary.com/kartik2403/image/upload/v1629308127/pic_tqwnpn.png"

    },
    followers : [{type : ObjectId , ref : "User"}],
    following : [{type : ObjectId , ref : "User"}]
})

mongoose.model("User",userSchema);               //we will we using this model to access the schema