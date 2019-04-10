var express = require('express');
var router = express.Router();
const cors = require('./cors');
var fs = require('fs');
var cron =  require('node-schedule');
/* GET home page. */
const volFood = require('../models/volFood');
router.route('/')
.get((req, res, next) => {
  fs.readFile('about_us.html',function(err,html){
    res.writeHead(200,{"Content-Type": "text/html"});
    res.write(html);
    res.end();
  });
  // res.sendFile('about_us.html',{"root":'.'});
});
// cron.scheduleJob('30 * * * * *', function(){
//   console.log('This runs at the 30th mintue of every hour.');
//   volFood.find({})
//   .then((foods) => {
//       if(foods!=null){
//         for(i=0;i<foods.length;i++){
//           if(foods[i].createdAt){

//           }
//         }
//       }
//   })
// });




module.exports = router;
