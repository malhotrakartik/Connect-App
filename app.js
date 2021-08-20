const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;              //heroku will choose the port
const mongoose = require("mongoose");
const {MONGOURI} = require('./config/keys');


 



mongoose.connect(MONGOURI,{                  //using connect method to connect to database
    useNewUrlParser : true,
    useUnifiedTopology : true
});             
mongoose.connection.on('connected',()=>{
    console.log("connected to data base");
})

mongoose.connection.on('error',(err)=>{
    console.log("error connecting to data base",err);
})


require('./models/user');                   //to acces user model in this file
require('./models/post');                     //registering post schema in our app so we can use it anywhere

app.use(express.json());                     //parsing incoming rqst to json

app.use(require('./routes/auth'));            //running auth route as a middleware
app.use(require('./routes/post'));
app.use(require('./routes/user'));


if(process.env.NODE_ENV == "production"){        //if app is on production side
    app.use(express.static('client/build'))
    const path = require('path');
    app.get("*",(req,res)=>{                         //if client will be making any request we will send index.html from client build
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


// const customMiddleware = (req,res,next) => {   
//     // console.log("hey");         
//     console.log("middle ware executed");
//     next();                                       //to execute next middleware/command after completion
// }

// app.use(customMiddleware);                     //executing middleware for every request

// app.get('/',customMiddleware,(req,res)=>{               //return a callback     //executing middleware for particular request
//     res.send("hello world");     
// })
app.listen(PORT,()=>{                                //bind and listen the connection on the port(returs a callback)
    console.log("server is running on port",PORT);
})