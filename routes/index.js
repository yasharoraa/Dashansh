var express = require('express');
var router = express.Router();
const cors = require('./cors');
var fs = require('fs');

/* GET home page. */
router.route('/')
.get((req, res, next) => {
  fs.readFile('about_us.html',function(err,html){
    res.writeHead(200,{"Content-Type": "text/html"});
    res.write(html);
    res.end();
  });
  // res.sendFile('about_us.html',{"root":'.'});
});

module.exports = router;
