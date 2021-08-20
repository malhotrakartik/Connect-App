//this middle ware would always be called while accessing some protected data
//it will check id the token provided is right or not and then only give access


const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/keys");
const  mongoose = require('mongoose');
const User = mongoose.model('User');



module.exports = (req,res,next) => {        //middleware to check authorization(that user have the token or not)
        const {authorization} = req.headers;                      //because token is passed in header with key authorization
        // authorization would be like Bearer <token>
        if(!authorization){                 //if user doesnt have the token
           return res.status(401).json({error : "you must be logged in"});
        }
        const token = authorization.replace("Bearer ","");
        jwt.verify(token,JWT_SECRET,(err,payload)=>{
            if(err){
                return res.status(401).json({error : "you must be logged in"});
            }

            const {_id} = payload
            User.findById(_id).then(userData => {
                req.user = userData;                            //all the details of the user will now get stored in req.user
                next();
            })
           
        })

}