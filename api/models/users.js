const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    name:{type:String, require:true},
    email:{type:String, require:true},
    password:{type:String,require:true},
    avatar:{type:String,require:true},
    date:{type:d=Date,require:Date.now}
});
module.exports=mongoose.model('user',userSchema);