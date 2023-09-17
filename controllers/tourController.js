const { query } = require('express');
const APIFeatures = require('../utils/apiFeatures');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//SAMPLE ALIASING CAN BE REMOVED
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage.price';
    req.query.fields = 'name, price, ratingsAverage, difficulty';
    next();
}; 

//EXECUTE QUERY
exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    const tours = await features.query;

//SEND RESPONSES
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        }) 
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    if(!tour) {
        return next(new AppError('No tour found with that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
            }
    })    
});

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!tour) {
        return next(new AppError('No tour found with that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    });  
});

exports.deleteTour =  catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id); 

    if(!tour) {
        return next(new AppError('No tour found with that id', 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    });    
});

exports.getTourStats = catchAsync(async (req, res, next) => {
        const stats =  await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats 
            }
        });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDate'
            },
            {
                $match: {
                    startDate: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDate' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' } 
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            results: plan.length,
            data: {
                plan 
            }
        });
});