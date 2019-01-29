const User = require('./users')

class UserMongo {
    constructor(){
    }

    static async findUserByEmail(req,isEmail){

        try{
            let user; 
            if(isEmail){
                user = await User.findOne({email : req.body.email}).exec()
            }else {
                user = await User.findById({_id : req}).exec()
            }
            
            if(user){
                return user
            }else {
                return false    
            }
        }catch(err){
            console.log('err.message :', err.message);
           
        }
    }

    
}

module.exports = UserMongo
