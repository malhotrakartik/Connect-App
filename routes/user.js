const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model("User");
const Post = mongoose.model("Post")


// getting user and all of its posts to display in its profile
router.get('/user/:id',requireLogin,(req,res)=>{
    // return res.status(402).json(req.params.id)
    //  req.params.id = "611780066c3c54d01861ed13"
    User.findOne({_id : req.params.id})
    .select("-password")
    .then(user => {
          Post.find({postedBy : req.params.id})
          .populate("postedBy" , "_id name")
          .exec((err,posts)=>{                                  //this posts will be an array containing all the posts posted by user
              if(err){
                return res.status(422).json({error : err})

              }
              res.json({user,posts});
          })
    })
    .catch(err => {
        return res.status(402).json({erorr : "User Not Found"})
    })
})


router.put('/follow',requireLogin,(req,res)=>{
        User.findByIdAndUpdate(req.body.followId,{
            $push : {followers : req.user._id}                       //jisko hum follow krre hai uske followers me apni id daalre hai
        },{
            new : true
        },(err,result)=>{
                  if(err){
                      return res.status(422).json({error : err});
                  }

                  User.findByIdAndUpdate(req.user._id,{
                      $push  : {following : req.body.followId}
                  },{
                      new : true
                  })
                  .select("-password")
                  .then(result => {
                       res.json(result);
                  })
                  .catch(err => {
                    return res.status(422).json({error : err});

                  })
        })
})

router.put('/unfollow',requireLogin,(req,res)=>{
        User.findByIdAndUpdate(req.body.unfollowId,{
            $pull : {followers : req.user._id}                       //jisko hum follow krre hai uske followers me apni id daalre hai
        },{
            new : true
        },(err,result)=>{
                  if(err){
                      return res.status(422).json({error : err});
                  }

                  User.findByIdAndUpdate(req.user._id,{
                      $pull  : {following : req.body.unfollowId}
                  },{
                      new : true
                  })
                  .select("-password")
                  .then(result => {
                     res.json(result);
                  })
                  .catch(err => {
                    return res.status(422).json({error : err});

                  })
        })
})


router.put('/updatepic' , requireLogin , (req,res)=>{
    User.findByIdAndUpdate({_id : req.user._id},
        {$set:{pic : req.body.pic}},{
            new : true
        },
        (err,result) => {                        //callback
           if(err){
               return res.status(422).json({error : "pic cannot be updated"})
           }
           res.json(result)
        }

    )
})

module.exports = router;