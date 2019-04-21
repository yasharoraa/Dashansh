const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Center = require('../models/center');

const centerRouter = express.Router();

centerRouter.use(bodyParser.json());

centerRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Center.find({})
            .then((centers) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(centers);

            }, (err) => next(err))

            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, (req, res, next) => {
        Center.create(req.body)
            .then((center) => {
                console.log('Center Created', center);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(center);

            },

                (err) => next(err))


            .catch((err) => next(err));


    })
    .put(cors.corsWithOptions,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on centers')

    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on centers')
    });

centerRouter.route('/:centerId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Center.findById(req.params.centerId)
            .populate('account')
            .then((center) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(center);

            }, (err) => next(err))

            .catch((err) => next(err));

    })

    .post(cors.corsWithOptions, (req, res, next) => {

        res.statusCode = 403;
        res.end('POST operation not supported on /center/');

    })
    .put(cors.corsWithOptions, (req, res, next) => {
        Center.findByIdAndUpdate(req.params.centerId, {
            $set: req.body
        }, { new: true })
            .then((center) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(center);

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions,  (req, res, next) => {

        // Dishes.findById(req.params.dishId)
        //     .then((dish) =>{
        //         if (dish.user.equals(req.user._id)) {
        //             Dishes.findByIdAndRemove(req.params.dishId)
        //                 .then((resp) => {
        //                     res.statusCode = 200;
        //                     res.setHeader('Content-Type', 'application/json');
        //                     res.json(resp);
        //                 }, (err) => next(err))
            
        //                 .catch((err) => next(err))
        //             }else{
        //                 err = new Error('You are not authorized to perform this operation');
        //                 err.status = 403;
        //                 return next(err);
        //             }
        //     },(err) => next(err))
        //     .catch((err) => next(err))
        res.statusCode = 403;
        res.end('DELETE operation not supported on /center/');
       

    });
module.exports = centerRouter;