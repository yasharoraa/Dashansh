const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Res = require('../models/restaurant');

const resRouter = express.Router();



resRouter.use(bodyParser.json());

resRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Res.find({})
            .then((rest) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(rest);

            }, (err) => next(err))

            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.user = req.user._id;
        Res.create(req.body)
            .then((rest) => {
                
                console.log('Dish Created', rest);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(rest);

            },

                (err) => next(err))


            .catch((err) => next(err));


    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on restaurants')

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Res.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))

            .catch((err) => next(err))
    });

resRouter.route('/:resId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {


        Res.findById(req.params.resId)
            .populate('dishes')
            .then((rest) => {
                console.log('Dish Created', rest);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(rest);

            }, (err) => next(err))

            .catch((err) => next(err));

    })

    .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {

        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/');

    })
    .put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Res.findByIdAndUpdate(req.params.resId, {
            $set: req.body
        }, { new: true })
            .then((rest) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(rest);

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {

        Res.findByIdAndRemove(req.params.resId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))

            .catch((err) => next(err))

    });

resRouter.route('/:resId/comments')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })

    .get(cors.cors, (req, res, next) => {
        Res.findById(req.params.resId)
            .populate('comments.author')
            .then((rest) => {
                if (res != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(rest.comments);
                } else {
                    err = new Error('restaurant' + req.params.resId + ' not found ');
                    err.status = 404;
                    return next(err);

                }


            }, (err) => next(err))

            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Res.findById(req.params.resId)
            .then((rest) => {
                if (rest != null) {
                    req.body.author = req.user._id;
                    rest.comments.push(req.body);
                    rest.save()
                        .then((rest) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(rest);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Restaurant ' + rest.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on dishes'
            + req.params.dishId + '/comments');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Res.findById(req.params.resId)
            .then((rest) => {
                if (rest != null) {
                    for (var i = (rest.comments.length - 1); i >= 0; i--) {
                        rest.comments.id(rest.comments[i]._id.remove());
                        rest.save()
                            .then((rest) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(rest);
                            }, (err) => next(err));
                    }
                } else {
                    err = new Error('Restaurant' + req.params.resId + ' not found ');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    });

resRouter.route('/:dishId/comments/:commentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {

        Res.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));


                } else if (dish == null) {
                    err = new Error('dish' + req.params.dishId + ' not found ');
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
        res.end('POST operation not supported on /dishes/'
            + req.params.dishId + '/comments' + req.params.comm);

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Res.findById(req.params.dishId)
            .then((dish) => {

                if (dish != null && dish.comments.id(req.params.commentId) != null) {

                    if (dish.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
                        if (req.body.rating) {
                            dish.comments.id(req.params.commentId).rating = req.body.rating;
                        }
                        if (req.body.comment) {
                            dish.comments.id(req.params.commentId).comment = req.body.comment;
                        }
                        dish.save()
                            .then((dish) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            }, (err) => next(err));
                    } else {
                        err = new Error('You are not authorized to perform this operation');
                        err.status = 403;
                        return next(err);
                    }
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.resId + ' not found');
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

        Res.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {

                    if (dish.comments.id(req.params.commentId).author._id.equals(req.user._id)) {

                        dish.comments.id(req.params.commentId).remove();
                        dish.save()
                            .then((dish) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            }, (err) => next(err));

                    } else {
                        err = new Error('You are not authorized to perform this operation');
                        err.status = 403;
                        return next(err);
                    }
                } else if (dish == null) {
                    err = new Error('dish' + req.params.dishId + ' not found ');
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
resRouter.route('/filters/veg')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Res.find({ vegType: 0 })
            .then((rests) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(rests);
            }, (err) => next(err))

            .catch((err) => next(err))
    });
resRouter.route('/filters/nonVeg')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Res.find({ vegType: 1 })
            .then((rests) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(rests);
            }, (err) => next(err))

            .catch((err) => next(err))
    });
resRouter.route('/filters/myRes')
.options(cors.cors, (req, res) => { res.sendStatus(200) })
.get(cors.cors, authenticate.verifyUser,(req, res, next) => {
    Res.find({ user: req.user._id})
        .then((rests) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(rests);
        }, (err) => next(err))

        .catch((err) => next(err))
});
resRouter.route('/:resId/dishes')
.options(cors.cors, (req,res) => {res.sendStatus(200)})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Res.findById(req.params.resId)
        .then((rest) => {
            if (rest != null) {
                if(rest.dishes.indexOf(req.body._id)<0){

                    rest.dishes.push(req.body);
                    rest.save()
                    .then((rest) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(rest);
                    }, (err) => next(err));
                    
                    
                }else{
                    err = new Error('Restautant ' + req.params.resId + ' already contains this foodItem');
                    err.status = 409;
                    return next(err);
               }
                
            }else {
                err = new Error('Restautant ' + req.params.resId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Res.findById(req.params.resId)
    .then((rest) => {
        if (rest != null) {
            if(rest.dishes.indexOf(req.body._id)>-1){
                var index = rest.dishes.indexOf(req.body._id);
                if (index !== -1) rest.dishes.splice(index, 1);
                rest.save()
                .then((rest) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(rest);
                }, (err) => next(err));
                
                
            }else{
                console.log(rest.dishes.indexOf(req.body._id));
                err = new Error('Restautant ' + req.params.resId + ' does not contains this foodItem');
                err.status = 409;
                return next(err);
           }
            
        }else {
            err = new Error('Restautant ' + req.params.resId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})


module.exports = resRouter;
