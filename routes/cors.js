const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000','https://localhost:3443','http://159.65.159.228:3000','https://159.65.159.228:3443','https://159.65.159.228:443','https://159.65.159.228:80'];

var corsOptionsDelegate = (req,callback) => {
    var corsOptions;

    if(whitelist.indexOf(req.header('Origin'))!== -1){
        corsOptions = {origin :  true};
    }else{
        corsOptions = {origin :false};
    }
    callback(null,corsOptions);
};

exports.cors = cors();
exports.corsWithOptions =  cors(corsOptionsDelegate);
