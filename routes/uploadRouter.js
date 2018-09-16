const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');
const crypto = require("crypto");



const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'/mnt/images');
    },

    filename : (req,file,cb) => {
        cb(null,/*file.originalname*/crypto.randomBytes(16).toString("hex"))
    }
});

const imageFileFilter = (req,file,cb) => {

    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('You can upload image files!'),false);
    }else{
        cb(null,true);
    }

    

};

const upload = multer({storage : storage,fileFilter:imageFileFilter});


const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json({limit:'10mb'}));

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.get(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELTE operation not supported on /imageUpload');
})
.post(cors.cors,authenticate.verifyUser,
    upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(req.file);   
});


module.exports = uploadRouter;
