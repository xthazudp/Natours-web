const { query } = require('express');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );



exports.getAllTours = async (req, res) => {
  // console.log(req.requestTime);

  try{
    console.log(req.query);
    
    // BUILD THE QUERY
    // 1.a) Filtering
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1.b) Advance Filtering
    // console.log(req.query, queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // {dificulty: 'easy', duration:{ $gte: 5} }
    // { difficulty: 'easy', duration: { gte: '5' } }
    // gte, gt, lte, lt

    // const query = Tour.find({
    //   duration : 5,
    //   difficulty: 'easy'
    // });

    // const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting

    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy)
    }else{
      query = query.sort('-createdAt');
    }

    // EXECUTE THE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch(err){
    res.status(404).json({
      status:'fail',
      message: err
    });
  };
};

exports.getTour = async(req, res) => {
  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status:'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try{
    // console.log(req.body);
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  }catch(err){
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  };
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators:true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      },
    });
  } catch (err) {
    res.status(404).json({
      status:'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status:'fail',
      message: err
    });
  }
};
