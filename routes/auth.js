const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs"); //using this package for password hashing
const jwt = require('jsonwebtoken');        //token provided to user at sign in to use protected resources
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require('../middleware/requireLogin')

router.get("/", (req, res) => {
    res.send("hello route");
});

router.post("/signup", (req, res) => {
    //whenever post is done this will run
    console.log(req.body);
    const { name, email, password,pic } = req.body;
    if (!name || !email || !password) {
        //return bcz when we encouter error we dont want to procees further
        return res.status(422).json({ error: "please enter all the fields" }); //sending respose as json   //sending specific status code to the api
    }

    User.findOne({ email: email })
        .then((savedUser) => {
            //finding if the email already exits in the data base
            if (savedUser) {
                return res
                    .status(422)
                    .json({ error: "user already exits with that email" });
            }

            bcrypt
                .hash(password, 10) //saving user with hashed password
                .then((hashedPassword) => {
                    //if not adding user to the database
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        name: name,
                        pic : pic
                    });

                    user
                        .save()
                        .then((user) => {
                            //if user is saved in the database  or not
                            res.json({ message: "user signed up successfully" });
                        })
                        .catch((err) => {
                            res.json({ error: "sign up failed", err });
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "user does not exits" });
    }

    User.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            //checking if email is present in the database
            return res.status(422).json({ error: "invalid email/password" });
        }

        bcrypt.compare(password, savedUser.password).then((doMatch) => {
            //it compare entered paswrd with pswrd in database and return a boolean value
            if (doMatch) {
                // res.json({ message: "sign in successfull" });

                const token = jwt.sign({_id : savedUser._id},JWT_SECRET);           //providing jwt token to the user id
                
                const {_id,name,email,followers,following,pic} = savedUser

                res.json({token , user : {_id,name,email,followers,following,pic}});                       //after sign in giving user a token and his details
            } else {
                return res.status(422).json({ error: "invalid email or password" });
            }
        }).catch(err => {
            console.log(err);
        })
    });
});

module.exports = router;
