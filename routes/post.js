const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post");

router.get('/allpost',requireLogin, (req, res) => {
    Post.find().populate("postedBy" , "_id name pic").populate("comments.postedBy", "_id name").then(post => {               //Population is the process of replacing the specified path in the document of one collection with the actual document from the other collection
        res.json({ posts: post });
    }).catch(err => {
        console.log(err);
    })
})


router.get('/getsubpost',requireLogin, (req, res) => {
    Post.find({postedBy : {$in:req.user.following}})                                //if posted by is present in following list
    .populate("postedBy" , "_id name pic").populate("comments.postedBy", "_id name")
    .then(post => {           
        res.json({ posts: post });
    }).catch(err => {
        console.log(err);
    })
})

router.post("/createpost", requireLogin, (req, res) => {
    const { title, body ,photo} = req.body;
    if (!title || !body || !photo) {
        return res.status(422).json({ error: "please add all the fields" });
    }

    req.user.password = undefined              //so password doesnt get stored in the post schema
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch((err) => {
            console.log(err);
        })


})

router.get('/myposts',requireLogin,(req,res)=>{              //we would always need requireLogin to access req.user
    Post.find({postedBy : req.user._id})
    .populate("PostedBy" , "_id name")
    .then(myPost =>{ 
        res.json({myPost})
    })
    .catch(err => {
        console.log(err);
    })
})

router.put('/like',requireLogin,(req,res)=>{                //put is used to update schema
    Post.findByIdAndUpdate(req.body.postId,{
             $push:{likes:req.user._id}                     //push will add id of user to likes array in post schema
    },{
        new:true                                            //to get an updated record from mongodb
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error : err});
        }
        return res.json(result);
    })
})
router.put('/unlike',requireLogin,(req,res)=>{                //put is used to update schema
    Post.findByIdAndUpdate(req.body.postId,{
             $pull:{likes:req.user._id}                     //pull will remove id of user to likes array in post schema
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error : err});
        }
        return res.json(result);
    })
})


router.put('/comment',requireLogin,(req,res)=>{                //put is used to update schema
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
             $push:{comments:comment}                     //push will add id of user to likes array in post schema
    },{
        new:true                                            //to get an updated record from mongodb
    })
    .populate("comments.postedBy" , "_id  name")
    .populate("postedBy" , "_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error : err});
        }
        return res.json(result);
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id : req.params.postId})                               //params are the parameters passed in url
    .populate("postedBy" , "_id")
    .exec((err,post)=>{
       if(err || !post){
           return res.status(422).json({error : err});
       }
       if(post.postedBy._id.toString() == req.user._id.toString()){
           post.remove()
           .then(result => {
               res.json(result)
           })
           .catch(err=>{
               console.log(err);
           })

       }
    })
})


module.exports = router