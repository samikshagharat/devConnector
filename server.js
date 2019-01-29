const express=require('express');
const mongoose=require('mongoose');
const passport =require('passport');
const bodyParser=require('body-parser');
const passportS = require('./config/passport');
const user=require('./api/route/user');

const profile=require('./api/route/profile');
const post=require('./api/route/post');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());
passportS(passport);

//DB config
const db=require('./config/keys').mongoURI;

mongoose 
.connect(db,{ useNewUrlParser: true } )
.then(()=> console.log('db is connected'))
.catch(err=> console.log(err));

// passport.use(new JwtStrategy({
//     jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey  :"this_is_My_Secr"

// },(jwt_payload, done) =>{
//     console.log("jwt_payload",jwt_payload)
//     // User.findById(jwt_payload.id)
//     // .then(user => {
//     //     if (user){
//     //         console.log('error');
//     //         return done(null, user);
//     //     }
//     //     return done(null , false);
//     // })
//     // .catch(err => console.log(err));
// })
// );



//passport config
// require('./config/passport')(passport);

app.use('/user',user);
app.use('/profile',profile);
app.use('/post',post);

app.get('/',(req, res)=>res.send('hello world'));

const port= process.env.PORT || 5000;

 app.listen(port, ()=> console.log(`Server running on ${port}`));

