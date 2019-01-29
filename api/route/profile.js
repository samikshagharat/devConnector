const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport=require('passport');
 const jwt = require('jsonwebtoken');

//  Validation
const validateprofileInput= require('../../validation/profile');
const validateExperienceInput= require('../../validation/experience');
const validateEducationInput=require('../../validation/education');


// load profile model
const profileSchema=require('../models/profile');
// load user model
const userSchema=require('../models/users');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public

router.get('/test',(req,res)=> {
    res.json({msg:'Profile works'})
} );

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private

router.get('/',passport.authenticate('jwt', {session:false}), (req, res)=> {
    console.log('AUTH')

    const errors = {};
    profileSchema.findOne({user:req.user.id})
    .populate('user',['name','avatar'])
    .then(profile =>{
        if(!profile) {
            errors.noprofile='There is no profile for this user';
            return res.status(200).json(errors);
        }
        res.json(profile);
    })
    .catch(err=> res.status(404).json(err));
});

router.get('/handle/:handle',(req,res)=>{
    const errors = {};
    
    profileSchema.findOne({ handle: req.params.handle})
    .populate('user',['name','avatar'])
    .then(profile =>{
        if(!profile){
            errors.noprofile='there is no profile for this user';
            res.status(404).json(errors);
        }
        // else{
            res.json(profile);
        // }
    })
    .catch(err=>{
        res.status(err).json(err)});
});

// @route get profile/user/user_id
// @desc Get profile by user Id
// access public
router.get('/user/:user_id',(req,res)=>{
    const errors={};
    profileSchema.findOne({user:req.params.user_id})
    .populate('user',['name','avatar'])
    .then(profile =>{
        if(!profile){
            errors.noprofile='There is no profile for this user';
            res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err=>res.status(err).json(err));
});

 router.get('/all',(req,res)=>{
     const errors ={};
     profileSchema.find()
     .populate('user',['name','avatar'])
     .then(profile =>{
         if(!profile){
             errors.noprofile='There is no profile for this user';
             res.status(404).json(errors);
         }
         res.json(profile);
     })
.catch(err=>res.status(err).json({ profile: 'There is no profile for this user' }));

 });


 // @route   POST /profile
// @desc    Create or edit user profile
// @access  Private

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    console.log(req.body)
    const {errors, isValid} = validateprofileInput(req.body);
    // check  validation
    if(!isValid) {
        // return any errors with 400 errors
        return res.status(400).json(errors);
    }
    // get fields
    const profileFields={};
    profileFields.user=req.user.id;
    if(req.body.handle) profileFields.handle=req.body.handle;
    if(req.body.company) profileFields.company=req.body.company;
    if(req.body.website) profileFields.website=req.body.website;
    if(req.body.location) profileFields.location=req.body.location;
    if(req.body.bio) profileFields.bio=req.body.bio;
    if(req.body.status) profileFields.status=req.body.status;
    if(req.body.githubusername) profileFields.githubusername=req.body.githubusername;
    // skills split in to array
    if(typeof req.body.skills !=='undefined') {
        profileFields.skills=req.body.skills.split(',');

    }
    profileFields.social={};
    if(req.body.youtube) profileFields.social.youtube=req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter=req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook=req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram=req.body.instagram;
    if(req.body.linkedin) profileFields.social.linkedin=req.body.linkedin;
    
    profileSchema.findOne({user:req.user.id}).then(profile =>{
        console.log('xfaxg');
        if(profile){
            // Update
           
            profileSchema.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            ).then(profile => res.json(profile));
        } else {
            // create


            // check for handle exists
            profileSchema.findOne({handle:profileFields.handle }).then(profile =>{
                if(profile) {
                    errors.handle= 'that handle already exist';
                    res.status(400).jsonp(errors);
                }
                // save profile
                new profileSchema(profileFields).save().then(profile=> res.json(profile));
            });
        }
    });

});

// @route post profile/experience
// @desc Add experince to profile
// access private

router.post('/experience',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isValid} = validateExperienceInput(req.body);
    // check  validation
    if(!isValid) {
        // return any errors with 400 errors
        return res.status(400).json(errors);
    }
    profileSchema.findOne({user:req.user.id })
   .then(profile =>{
      const newExp={
          title: req.body.title,
          company:req.body.company,
          location:req.body.location,
          from:req.body.from,
          to:req.body.to,
          current:req.body.current,
          description:req.body.description
}
// add to exp array
profile.experiences.unshift(newExp);
 profile.save().then(profile=>res.json(profile));
   })

});

// @route post profile/education
// @desc Add education to profile
// access private


router.post('/education',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isValid} = validateEducationInput(req.body);
    // check  validation
    if(!isValid) {
        // return any errors with 400 errors
        return res.status(400).json(errors);
    }
    profileSchema.findOne({user:req.user.id })
   .then(profile =>{
      const newEdu={
        School: req.body.School,
          degree:req.body.degree,
          fieldofstudy:req.body.fieldofstudy,
          from:req.body.from,
          to:req.body.to,
          current:req.body.current,
          description:req.body.description
}
// add to exp array
profile.education.unshift(newEdu);
 profile.save().then(profile=>res.json(profile));
   })

});


// @route delete profile/experience
// @desc delete experience to profile
// access private

router.delete('/experience/:exp_id',passport.authenticate('jwt',{session:false}),(req,res)=> {
    // const {errors, isValid} = validateexperienceInput(req.body);
    console.log('enter delete route')
    profileSchema.findOne({user:req.user.id }).then(profile =>{
        
        const removeIndex = profile.experiences
        .map(item => JSON.stringify(item._id))
        .indexOf(JSON.stringify(req.params.exp_id));
     //    splice out of array
     profile.experiences.splice(removeIndex, 1);
    
     // save
     profile.save().then(profile => res.json(profile));
     })
     .catch(err=> res.status(404).json(err));

     });
   
     // @route delete profile/education
    // @desc delete education to profile
    // access private

     router.delete('/education/:edu_id',passport.authenticate('jwt',{session:false}),(req,res)=> {
        // const {errors, isValid} = validateEducationInput(req.body);
        console.log('enter delete route')
        profileSchema.findOne({user:req.user.id }).then(profile =>{
            
            const removeIndex = profile.education
            .map(item => item._id)
            .indexOf(req.params.edu_id);
         //    splice out of array
         profile.education.splice(removeIndex, 1);
         // save
         profile.save().then(profile => res.json(profile));
         })
         .catch(err=> res.status(404).json(err));
    
         });


         router.delete('/',passport.authenticate('jwt',{session:false}),
         (req,res)=> {
            // const {errors, isValid} = validateEducationInput(req.body);
            
            profileSchema.findOneAndDelete({user:req.user.id }) .then(() =>{
             userSchema.findOneAndDelete({_id:req.user.id })
            .then(()=>
               res.json({success:true})
               );
            })
            
            .catch(err=> res.status(404).json(err));
    
        });
    
module.exports=router;
