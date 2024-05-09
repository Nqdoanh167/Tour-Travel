/** @format */
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
   catchAsync(async (req, res, next) => {
      const features = new APIFeatures(Model.find(), req.query).filter().sort().limitFields().paginate();
      const docs = await features.query;
      const total = await Model.countDocuments();
      res.status(200).json({
         status: 'success',
         results: docs.length,
         total,
         data: docs,
      });
   });

exports.getOne = (Model, popOptions) =>
   catchAsync(async (req, res, next) => {
      let query;
      if (req.params.slug) {
         query = {slug: req.params.slug};
      } else if (req.params.id) {
         query = {_id: req.params.id};
      }
      let queryData = Model.findOne(query);
      if (popOptions) queryData = queryData.populate(popOptions);
      const doc = await queryData;
      if (!doc) {
         return next(new AppError('Document is not found', 404));
      }
      res.status(200).json({
         status: 'success',
         data: doc,
      });
   });

exports.createOne = (Model, data) =>
   catchAsync(async (req, res, next) => {
      let obj = {};
      if (req.user) req.body.user = req.user._id;
      if (data) obj = Object.assign({}, data, req.body);
      else obj = req.body;
      const newDoc = await Model.create(obj);
      res.status(201).json({
         status: 'success',
         data: newDoc,
      });
   });
exports.deleteOne = (Model) =>
   catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) {
         return next(new AppError(`No document found with that ID`, 404));
      }
      res.status(204).json({
         status: 'delete success',
         data: null,
      });
   });
exports.updateOne = (Model) =>
   catchAsync(async (req, res, next) => {
      console.log(req.body);
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      });
      if (!doc) {
         return next(new AppError(`No document found with that ID`, 404));
      }
      res.status(200).json({
         status: 'update success',
         data: {
            data: doc,
         },
      });
   });
