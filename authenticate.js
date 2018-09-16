var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');

var JwtStrategy = require('passport-jwt').Strategy;

var ExtractJwt = require('passport-jwt').ExtractJwt;

var admin = require('firebase-admin');

var serviceAccount  = require('./service_account.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// var jwt = require('jsonwebtoken');

// var config = require('./config');



// exports.local = passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());

// passport.deserializeUser(User.deserializeUser());

// exports.getToken = function(user) {
//     return jwt.sign(user,config.secretKey);
// };

// var opts = {};

// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// opts.secretOrKey = config.secretKey;

// exports.jwtPassport = passport.use(new JwtStrategy(opts,
//     (jwt_payload,done) => {
//         console.log("JWT payload: ",jwt_payload);
//         User.findOne({_id: jwt_payload._id},(err,user) => {
//             if(err) {
//                 return done(err,false);
//             } else if (user) {
//                 return done(null,user);
//             } else {
//                 return done(null,false);
//             }
//         });
//     }));


//     exports.verifyAdmin = (req,res,next) => {
//         if(req.user.admin){
//             next();
//         }else{
//             err = new Error('You are not authorized to perform this operation!');
//             err.status = 403;
//             next(err);           
//         }
//     };

    
    // exports.verifyUser = passport.authenticate('jwt',{session : false});

    exports.verifyUser = (req,res,next)=> {
        admin.auth().verifyIdToken(req.header('Token'))
        .then(function(decodedToken) {
          var uid = decodedToken.uid;
          User.findOne({userId:uid},(err,user) => {
              if(err){
                next(err);   
              }else if (user){
                req.user = user;
                next();
              }else{
                err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                next(err);
              }
          })
          // ...
        }).catch(function(error) {
          // Handle error
          next(error);
          console.log(error);
        });
    };
    

//     exports.firebaseAuth = (idToken) => {
//     admin.auth().verifyIdToken(idToken)
//     .then(function(decodedToken) {
    
//     console.log(decodedToken)
//       var uid = decodedToken.uid;
//       User.findOne({userId:uid},(err,user) => {
//           if(err){
//               return done(err,false);
//           }else if (user){
//               return done(null,user);
//           } else {
//               User.register(new User({userId:uid}),(err,user) => {
//                   if(err){
//                       return done(err,false);
//                   } else if (user) {
//                       return done(null,user);
//                   }
//               })
//           }
//       })
//       // ...google-services
//     }).catch(function(error) {
//       // Handle error
//     });
//     }
//     exports.verifyUser = (idToken) => {
//         admin.auth().verifyIdToken(idToken)
//         .then(function(decodedToken) {
//           var uid = decodedToken.uid;
//           User.findOne({userId:uid},(err,user) => {
//               if(err){
//                   return done(err,false);
//               }else if (user){
//                   return done(null,user);
//               }else {
//                   return done(null,false);
//               }
//           })
//           // ...
//         }).catch(function(error) {
//           // Handle error
//           console.log(error);
//         });
//     }

    
    
      

    

