const { query } = require('express');
const Tour = require('../models/tourModel')

exports.getAllTours = async (req, res) => {
    try {
//BUILD QUERY
        console.log(req.query)
        const queryObj = {...req.query}; 
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

//FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr));

//SORTING
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt');
        }

//FIELD LIMITING
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query =query.select('-__v');
        }

//PAGINATION
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page -1) * limit;
        query = query.skip(skip).limit(limit);
        
        if(req.query.page) {
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error('This page does not exist');
        }

//EXECUTE QUERY
        const tours = await query;

//SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        }) 
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch(err) {
        res.send(404).json({
            status: 'fail',
            message: err
        })
    }    
};

exports.createTour = async (req, res) => {
    try {
    const newTour = await Tour.create(req.body);
    
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.updateTour = async (req, res) => {
 try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    });
 } catch(err) {
    res.status(404).json({
        status: 'fail',
        message: err
    })
 }
    
}

exports.deleteTour =  async (req, res) => {
 try {
    const tour = await Tour.findByIdAndDelete(req.params.id); 

    res.status(204).json({
        status: 'success',
        data: null
    });
 } catch(err) {
    res.status(404).json({
        status: 'fail',
        message: err
    })
 }    
}

exports.getTourStats = async (req, res) => {
    try {
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
                tour: stats 
            }
        });
    } catch {
      res.status(404).json({
        status: 'fail',
        message: err
    })  
    }
}
