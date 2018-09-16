const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const volFood = require('../models/volFood');

const volFoodRouter = express.Router();

volFoodRouter.use(bodyParser.json());

volFoodRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        volFood.find({})
        .populate('volId')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);

            }, (err) => next(err))

            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.user = req.user._id;
        volFood.create(req.body)
            .then((dish) => {
                console.log('Dish Created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);

            },

                (err) => next(err))


            .catch((err) => next(err));


    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on dishes')

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        volFood.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))

            .catch((err) => next(err))
    });

volFoodRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {


        volFood.findById(req.params.dishId)
            .populate('volId')
            .then((dish) => {
                console.log('Dish Created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);

            }, (err) => next(err))

            .catch((err) => next(err));

    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/');

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        volFood.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        volFood.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))

            .catch((err) => next(err))

    });
    volFoodRouter.route('/filters/veg')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        volFood.find({ foodType: 0 })
        .populate('volId')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))

            .catch((err) => next(err))
    });
    volFoodRouter.route('/filters/nonVeg')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        volFood.find({ foodType: 1 })
        .populate('volId')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))

            .catch((err) => next(err))
    });
    volFoodRouter.route('/filters/myVol/:volId')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        volFood.find({ volId : req.params.volId })
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))

            .catch((err) => next(err))
    });
    volFoodRouter.route('/filters/findVol/:volId')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        volFood.find({ volId : req.params.volId })
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))

            .catch((err) => next(err))
    });
    

module.exports = volFoodRouter;
