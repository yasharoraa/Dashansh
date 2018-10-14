var express = require('express');
var router = express.Router();
const cors = require('./cors');

/* GET home page. */
router.route('/')
.get((req, res, next) => {
  res.sendFile('about_us.html',{"root":'.'});
});

module.exports = router;
