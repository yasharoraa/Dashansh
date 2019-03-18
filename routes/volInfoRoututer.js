const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const VInfo = require('../models/VolInfo');
const volInfoRouter = express.Router();
volInfoRouter.use(bodyParser.json());

volInfoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        VInfo.find({})
            .then((volInfo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(volInfo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.user = req.user._id;
        VInfo.create(req.body)
            .then((volId) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(volId);
            },

                (err) => next(err))

            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on volunteers');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on volunteers');
    });

volInfoRouter.route('/:volInfoId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        VInfo.findById(req.params.volInfoId)
            .then((volInfo) => {
                console.log('newVolunteerCreated',volInfo);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(volInfo);
            },
            (err) => next(err))

            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        res.statusCode = 403;
        res.end('POST operation not supported on /volunteers/');

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        VInfo.findByIdAndUpdate(req.params.resId, {
            $set: req.body
        }, { new: true })
            .then((volInfo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(volInfo);

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Vol.findByIdAndRemove(req.params.resId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))

            .catch((err) => next(err))

    });

    module.exports = volInfoRouter;