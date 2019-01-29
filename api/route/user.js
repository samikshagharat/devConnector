const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt= require('bcryptjs');
const userSchema=require('../models/users');
const jwt=require('jsonwebtoken');
const keys=require('../../config/keys');
const passport=require('passport');

// Load input Validaton
const validateRegisterInput =require('../../validation/register');
const validateLoginInput= require('../../validation/login');


router.get('/test',(req,res)=> res.json({msg:'user works'}));

router.post('/register',(req,res,next)=>{
    console.log(req.body)
    const {errors, isValid} = validateRegisterInput(req.body);
    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    userSchema.findOne({email:req.body.email})
    .then(user=>{
        if(user){
            return res.status(400).json({
                message:'Emaile is already exist'
            })
        }
        else {
            const avatar = gravatar.url(req.body.email, {
                s:'200',
                r:'pg',
                d:'mm'
            });
              const newuser = new userSchema({
                name:req.body.name,
                email:req.body.email,
                avatar,
                password:req.body.password
              });
              bcrypt.genSalt(10,(err,salt)=> {
                  bcrypt.hash(newuser.password,salt, (err,hash)=>{
                      if(err) throw err;
                      newuser.password=hash;
                      newuser.save()
                      .then(User=> res.json(User))
                      .catch(err=> console.log(err));
                  } )
              })
        }
    
    });
});
router.post('/login',(req, res)=>{
    const {errors, isValid} = validateLoginInput(req.body);
    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email=req.body.email;
    const password=req.body.password;
    // find user by email

     userSchema.findOne({email})
     .then(user =>{
         if(!user){
             errors.email='user not found';
             return res.status(400).json(errors);
         }
         bcrypt.compare(password,user.password).then(isMatch=>{
            if(isMatch){
                const payload= {id:user.id, name:user.name,avatar:user.avatar};

                jwt.sign( payload,
                     keys.SecretOrKey,
                     {expiresIn:3600},
                     (err, token)=>
                     res.json({
                         sucess:true,
                         token:'Bearer ' + token
                     }));
            }
            else{
                errors.password='password Incorrect';
                return res.status(400).json(errors);
            }
         });
     });
});


module.exports=router;