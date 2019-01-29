const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport= require('passport');

const postSchema=require('../models/post');
const profileSchema=require('../models/profile');


const validatepostInput= require('../../validation/post');
// const validateprofileInput= require('../../validation/profile');

// @route get profile/post
// @desc Get post 
// access public

router.get('/',(req,res)=>{
    postSchema.find()
    .sort({date: -1})
    .then(post=> res.json(post))
    .catch(err=> res.status(404).json({nopostsfound: 'No post found with that Id'})
    );
});

// @route get post/:id
// @desc Get post by id
// access public

router.get('/:id',(req,res)=>{
    postSchema.findById(req.params.id)
    .then(post=> res.json(post))
    .catch(err=> 
        res.status(404).json({nopostfound: 'No post found with that Id'})
        );
});

// @route POST route/post 
// @desc create post 
// access private

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isValid } = validatepostInput(req.body);
    if(!isValid){
        return req.status(400).json(errors);
    }
const newpost = new postSchema({
   text:req.body.text,
   name: req.body.name,
   avatar:req.body.avatar,
   user:req.user.id 
});
 newpost.save().then(post=> res.json(post));
});

// @route DELETE route/post/:id 
// @desc delete post 
// access private

router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
//    const {errors,isValid} = validatepostInput(req, body);
//    profileSchema.findOne({user:req.user.id})
//    .then( profile => {
    postSchema.findOneAndRemove(req.params.id)
    .then( post=> {
        return res.json({success: true})
        
        // check for post owner
        // if(post.user.toString()!== req.user.id) {
        //     return res.status(401).json({notauthorized:'User not authorized'});
    
        // }
        // delete
        // post.remove().then(()=> res.json({success: true}));

    })
    .catch(err = res.status(404).json({postnotfound:'POST NOT FOUND'}));
   })
    //  .catch(err = res.status(404).json({profileSchema:'profileSchema not found'}));
//  });

// @route POST route/post/like/:_id
// @desc like post 
// access private

router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
       profileSchema.findOne({user: req.user.id})
       .then( profile => {
        postSchema.findById(req.params.id)
        .then( post=> {
            if(
                post.likes.filter(like => like.user.toString() === req.user.id)
                .length > 0
            )
            {
                return res
                .status(400)
                .json({ alreadyliked: 'User already like this post'});
            }
            post.likes.unshift({user: req.user.id});
            post.save().then(post=> res.json(post));
            
        })
        .catch(err = res.status(404).json({ postnotfound: 'POST NOT FOUND'}));
       })
         
    });

// @route POST route/post/unlike/:id
// @desc unlike post 
// access private

    router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
        
           profileSchema.findOne({user:req.user.id})
           .then( profile => {
            postSchema.findById(req.params.id)
            .then( post=> {
                if(
                    post.likes.filter(like => like.user.toString()=== req.user.id)
                    .length === 0
                )
                {
                    return res
                    .status(400)
                    .json({ notliked: 'you have not yet like this post'});
                }
                // Get remove index
                const removeIndex= post.likes
                .map(item=> item.user.toString())
                .indexOf(req.user.id);

                // Splice out of array
                post.likes.splice(removeIndex, 1);
                // save
                post.save().then(post=> res.json(post));
            })
            .catch(err = res.status(404).json({postnotfound:'POST NOT FOUND'}));
           });
             
        });
    
 // @route POST route/post/comment/:id
// @desc Add comment into post 
// access private

router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isValid } = validatepostInput(req.body);
    if(!isValid){
        return req.status(400).json(errors);
    }
    
    postSchema.findById(req.params.id)
    .then(post =>{
        const newCommnt = {
            text:req.body.text,
            name:req.body.name,
            avatar:req.body.avatar,
            user:req.user.id
        }
        post.comments.unshift(newCommnt);

        post.save().then(post=> res.json(post))
    })
    .catch(err => res.status(404).json({postnotfound:'No post'}));
});


// @route DELETE route/post/comment/:id/:commennt_id
// @desc remove comment post 
// access private

router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    postSchema.findById(req.params.id)
    .then(post =>{
        // check to see if the comment exists
        if(post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id).length === 0)
        {
            return res.status(404)
            .json({commentnotexists:'comment not exist'});
        }
        // Get remove index
        
        const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);
        
        // Splice comment out of array
        post.comments.splice(removeIndex, 1);
        post.save().then(post =>res.json(post));
    })
    .catch(err => res.status(404).json({postnotfound:'No post found'}));
});
module.exports=router;