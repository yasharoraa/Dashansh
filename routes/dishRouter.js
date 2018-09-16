const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);

            }, (err) => next(err))

            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.user = req.user._id;
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish Created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);

            },

                (err) => next(err))


            .catch((err) => next(err));


    })
    .put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on dishes')

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on dishes')
    });

dishRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {


        Dishes.findById(req.params.dishId)
            .populate('resId')
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
        Dishes.findByIdAndUpdate(req.params.dishId, {
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

        if (dish.user.equals(req.user._id)) {

        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))

            .catch((err) => next(err))
        }else{
            err = new Error('You are not authorized to perform this operation');
            err.status = 403;
            return next(err);
        }

    });
    dishRouter.route('/filters/inHouseFood')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Dishes.find({foodType:1})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);

            }, (err) => next(err))

            .catch((err) => next(err));
    });
    dishRouter.route('/filters/inHouseFood/veg')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Dishes.find({foodType:1,foodVegType:0})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);

            }, (err) => next(err))

            .catch((err) => next(err));
    });
    dishRouter.route('/filters/inHouseFood/nonVeg')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Dishes.find({foodType:1,foodVegType:1})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);

            }, (err) => next(err))

            .catch((err) => next(err));
    });


module.exports = dishRouter;
