const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Vol = require('../models/volunteer');

const volRouter = express.Router();

volRouter.use(bodyParser.json());

volRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Vol.find({})
            .then((vol) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vol);

            }, (err) => next(err))

            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.user = req.user._id;
        Vol.create(req.body)
            .then((vol) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vol);

            },

                (err) => next(err))


            .catch((err) => next(err));


    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on volunteers')

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vol.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))

            .catch((err) => next(err))
    });

volRouter.route('/:resId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {


        Vol.findById(req.params.resId)
            .then((rest) => {
                console.log('Dish Created', rest);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(rest);

            }, (err) => next(err))

            .catch((err) => next(err));

    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        res.statusCode = 403;
        res.end('POST operation not supported on /volunteers/');

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vol.findByIdAndUpdate(req.params.resId, {
            $set: req.body
        }, { new: true })
            .then((rest) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(rest);

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

volRouter.route('/:resId/comments')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })

    .get(cors.cors, (req, res, next) => {
        Vol.findById(req.params.resId)
            .populate('comments.author')
            .then((res) => {
                if (res != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(res.comments);
                } else {
                    err = new Error('volunteer' + req.params.resId + ' not found ');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))

            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vol.findById(req.params.resId)
            .then((vol) => {
                if (vol != null) {
                    req.body.author = req.user._id;
                    vol.comments.push(req.body);
                    vol.save()
                        .then((vol) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(vol);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Volunteer ' + req.params.resId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Res.findById(req.params.resId)
        .then((rest) => {
            if(rest!=null){
                    var rating;
                    var found;
                    var array = rest.comments;
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].author.equals(req.user._id)) {
                            rating = array[i];
                            found = true;
                            break;
                        }else{
                            found =false;
                        }
                    }
                    if(found){
                        if(rating){
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(rating);
                        }
                        
                    }else{
                      res.statusCode  = 404;
                      res.json("not found");  
                    }
            }
        },(err) => next(err))
        .catch((err) => next(err))
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.resId)
            .then((vol) => {
                if (vol != null) {
                    for (var i = (vol.comments.length - 1); i >= 0; i--) {
                        vol.comments.id(vol.comments[i]._id.remove());
                        vol.save()
                            .then((vol) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(vol);
                            }, (err) => next(err));
                    }
                } else {
                    err = new Error('Volunteer' + req.params.resId + ' not found ');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    });

volRouter.route('/:VolId/comments/:commentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {

        Dishes.findById(req.params.VolId)
            .populate('comments.author')
            .then((Vol) => {
                if (Vol != null && Vol.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(Vol.comments.id(req.params.commentId));


                } else if (Vol == null) {
                    err = new Error('Vol' + req.params.VolId + ' not found ');
                    err.status = 404;
                    return next(err);

                } else {
                    err = new Error('Comment' + req.params.commentId + ' not found ');
                    err.status = 404;
                    return next(err);
                }


            }, (err) => next(err))

            .catch((err) => next(err));

    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        res.statusCode = 403;
        res.end('POST operation not supported on /Voles/'
            + req.params.VolId + '/comments' + req.params.comm);

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.VolId)
            .then((Vol) => {

                if (Vol != null && Vol.comments.id(req.params.commentId) != null) {

                    if (Vol.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
                        if (req.body.rating) {
                            Vol.comments.id(req.params.commentId).rating = req.body.rating;
                        }
                        if (req.body.comment) {
                            Vol.comments.id(req.params.commentId).comment = req.body.comment;
                        }
                        Vol.save()
                            .then((Vol) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(Vol);
                            }, (err) => next(err));
                    } else {
                        err = new Error('You are not authorized to perform this operation');
                        err.status = 403;
                        return next(err);
                    }
                }
                else if (Vol == null) {
                    err = new Error('Dish ' + req.params.VolId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Dishes.findById(req.params.VolId)
            .then((Vol) => {
                if (Vol != null && Vol.comments.id(req.params.commentId) != null) {

                    if (Vol.comments.id(req.params.commentId).author._id.equals(req.user._id)) {

                        Vol.comments.id(req.params.commentId).remove();
                        Vol.save()
                            .then((Vol) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(Vol);
                            }, (err) => next(err));

                    } else {
                        err = new Error('You are not authorized to perform this operation');
                        err.status = 403;
                        return next(err);
                    }
                } else if (Vol == null) {
                    err = new Error('Vol' + req.params.VolId + ' not found ');
                    err.status = 404;
                    return next(err);

                } else {
                    err = new Error('Comment' + req.params.commentId + ' not found ');
                    err.status = 404;
                    return next(err);
                }

            }, (err) => next(err))
            .catch((err) => next(err))
    });
    volRouter.route('/filters/myVol')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser,(req, res, next) => {
    Vol.findOne({ user: req.user._id})
        .then((vol) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(vol);
        }, (err) => next(err))

        .catch((err) => next(err))
});


module.exports = volRouter;
