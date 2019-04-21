const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const account = require('../models/account');

const accountRouter = express.Router();

accountRouter.use(bodyParser.json());

accountRouter.route('/')
    .post(cors.corsWithOptions, (req, res, next) => {
        account.create(req.body)
            .then((account) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(account);

            },

                (err) => next(err))


            .catch((err) => next(err));


    });

accountRouter.route('/:accountId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .put(cors.corsWithOptions, (req, res, next) => {
        account.findByIdAndUpdate(req.params.accountId, {
            $set: req.body
        }, { new: true })
            .then((account) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(account);

            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = accountRouter;
