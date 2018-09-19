var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

var admin = require('firebase-admin');

var serviceAccount  = require('../service_account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */

//   router.get('/',cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {

//     User.find({})
//     .then((users) => {
//       res.statusCode = 200;
//       res.setHeader('Content-Type','application/json');
//       res.json(users);
//     },(err) => next(err))

//     .catch((err) => next(err));
//   });

// router.post('/signup', cors.corsWithOptions,(req, res, next) => {
//   User.register(new User({ username: req.body.username }),
//     req.body.password, (err, user) => {
//       if (err) {
//         res.statusCode = 500;
//         res.setHeader('Content-Type', 'application/json');
//         res.json({ err: err });
//       }
//       else {
//         if (req.body.firstname)
//           user.firstname = req.body.firstname;
//         if (req.body.lastname)
//           user.lastname = req.body.lastname;
//         user.save((err, user) => {
//           if (err) {
//             res.statusCode = 500;
//             res.setHeader('Content-Type', 'application/json');
//             res.json({ err: err });
//             return;
//           }
//           passport.authenticate('local')(req, res, () => {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json({ success: true, status: 'Registration Successful!' });
//           });
//         });
//       }
//     });
// });


// router.post('/login',passport.authenticate('local'), (req, res) => {

//   var token = authenticate.getToken({ _id: req.user._id });
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'application/json');
//   res.json({ success: true, token: token, status: 'You are successfully loggedin!' });

// });

// router.get('/logout',cors.corsWithOptions, (req, res) => {
//   if (req.session) {
//     req.session.destroy();
//     res.clearCookie('session-id');
//     res.redirect('/');
//   } else {
//     var err = new Error('You are not logged in!');
//     err.status = 403;
//     next(err);
//   }
// });

// router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
//   if (req.user) {
//     var token = authenticate.getToken({_id: req.user._id});
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({success: true, token: token, status: 'You are successfully logged in!'});
//   }
// });
// router.get('/auth/google',passport.authenticate('google', {
//   scope: [
//       'https://www.googleapis.com/auth/userinfo.profile',
//       'https://www.googleapis.com/auth/userinfo.email'
//   ]
// }),(req,res) => {
//     var token = authenticate.getToken({_id: req.user._id});
//     res.statusCode =200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({success: true, token: token, status: 'You are successfully logged in!'});
// });

// router.get( '/auth/google/callback',
// 	passport.authenticate('google'),(req,res) => {
//     var token = authenticate.getToken({_id: req.user._id});
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({success: true, token: token, status: 'You are successfully logged in!'});
//   }
// );


// router.post('/auth/firebase/checkname/:userId',(req,res) => {
//   User.findById(req.params.userId)
//   .then((user) => {
//       if(user.firstname){
//           res.statusCode = 200;
//           res.setHeader('Content-Type', 'application/json');
//           res.json(user);
//       }else{
//         User.findByIdAndUpdate(req.params.userId, {
//           $set: req.body
//       }, { new: true })
//           .then((user) => {
//               res.statusCode = 200;
//               res.setHeader('Content-Type', 'application/json');
//               res.json(user);
//           }, (err) => next(err))
//           .catch((err) => next(err));
//       }
//   })
// });

// router.get('/auth/firebase/logInUser',(req,res) => {
//   console.log(req.header('token'));
//   return authenticate.firebaseAuth(req.header('token'))
//   .then((user) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json(user);
//   },(err) => next(err))
//   .catch((err) => next(err))
// });5jb20vZGFzaGFuc2gtYXBwIiwibmFtZSI6Illhc2ggQXJvcmEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy15SzFocnVEMGxOTS9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BUFVJRmFNLTk1ZTBqMG0xWjhMQzc4Q2g2RVpVV1Y3YlJBL3M5Ni1jL3Bob3RvLmpwZyIsImF1ZCI6ImRhc2hhbnNoLWFwcCIsImF1dGhfdGltZSI6MTUzNjk4NzA5MSwidXNlcl9pZCI6IlpRWjN6VmtteERPeExHSnBDcTR6cDFySFNSRjIiLCJzdWIiOiJaUVozelZrbXhET3hMR0pwQ3E0enAxckhTUkYyIiwiaWF0IjoxNTM2OTg3MTU2LCJleHAiOjE1MzY5OTA3NTYsImVtYWlsIjoieWFzaC5hcm9yYTE3MDRAZ21haWwuY29



router.get('/auth/firebase/verifyUser',(req,res) => {
  admin.auth().verifyIdToken(req.header('Token'))
  
  .then((decodedToken) => {
    var uid = decodedToken.uid;
    console.log(decodedToken);
    User.findOne({userId:uid},(err,user) => {
      if(err){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json(err);
        console.log("ERROR FIDING USER");
      } else if (user) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
        console.log("user Exists");
        console.log(user);
      } else{
        User.create({userId:uid,firstname:decodedToken.name},(err,user) => {
          if(err){
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json(err);
            console.log("error creating user");
          }else if(user){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
            console.log("user succesfully created");
          }
        })
      }
    })
  }).catch(function(error) {
    // Handle error
    
    console.log(error);
  })
    
});

router.route('/auth/verifyUser')
.get(authenticate.verifyUser,(req,res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(req.user);
})


module.exports = router;
