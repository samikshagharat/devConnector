const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const postSchema=mongoose.Schema({
    user: {type:Schema.Types.ObjectId, ref:'user'},
    text: {type:String, rquired:true},
    name: {type:String },
    avatar: {typ:String },

    likes:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:'user'
        }
    }],

    comments:[{
        user:{
            type:Schema.Types.ObjectId, ref:'user'
        },
        text:{type:String, required:true},
        name:{type:String, },
        avatar:{typ:String},
        date:{type:Date,
            default: Date.now
            }
    }],
    date:{type:Date,
        default: Date.now
        }
    
});
module.exports=mongoose.model('post',postSchema);