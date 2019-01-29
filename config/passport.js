// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const mongoose = require('mongoose');
// const User = mongoose.model('user');
// const keys = require('./keys');

// const opts = {};
// // opts.jwtFromRequest =ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.jwtFromRequest =ExtractJwt.fromAuthHeaderWithScheme('JWT');
// opts.SecretOrKey = "this_is_My_Secr";
 
// module.exports= passport =>{
//     passport.use(new JwtStrategy({
//         jwtFromRequest :ExtractJwt.fromAuthHeader(),
//         SecretOrKey :"this_is_My_Secr"

//     },(jwt_payload, done) =>{
//         console.log(">>>>>>>>>>>>>>>>>.")
//         // User.findById(jwt_payload.id)
//         // .then(user => {
//         //     if (user){
//         //         console.log('error');
//         //         return done(null, user);
//         //     }
//         //     return done(null , false);
//         // })
//         // .catch(err => console.log(err));
//     })
//     );
// };


const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const keys = require('../config/keys')
const userFind = require('../api/models/UserMongo')
// require('../api/models/users')

// mongoose.model('User')

const otps = {}

otps.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
otps.secretOrKey = keys.SecretOrKey

module.exports = passport => {
    passport.use(new JWTStrategy(otps, async (jwt_payload,done)=>{
        const user = await userFind.findUserByEmail(jwt_payload.id, false)
        if(user){
            done(null, user)
        }else {
            done(null,false)
        }
        //console.log('jwt_payload :', jwt_payload);
    }))
}