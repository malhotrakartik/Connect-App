const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;             //just a datatype to give it to an entiity in schema
const postSchema = new mongoose.Schema({
    //this statement tells the mongodb to create new schema in db
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required : true,
    },
    likes:[
        {
            type : ObjectId,
            ref : "User"                      //ref in mongoose is used to refer another schema 
        }
    ],
    comments:[
        {
            text : String,
            postedBy : {type : ObjectId,ref : "User"}
        }
    ],
    postedBy: {
        //storing id of user who posted
        type: ObjectId,
        ref: "User",
    },
});

mongoose.model("Post", postSchema);
