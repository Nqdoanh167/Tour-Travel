/** @format */
const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'A tour must have a name'],
         unique: true,
         trim: true,
         maxlength: [40, 'A tour name must have less or equal then 40 characters'],
         minlength: [10, 'A tour name must have more or equal then 10 characters'],
      },
      slug: String,
      duration: {
         type: String,
         required: [true, 'A tour must have a duration'],
      },
      maxGroupSize: {
         type: Number,
         required: [true, 'A tour must have a group size'],
      },
      difficulty: {
         type: String,
         required: [true, 'A tour must have a difficulty'],
         enum: {
            values: ['dễ', 'trung bình', 'khó'],
            message: 'Difficulty is either: dễ, trung bình, khó',
         },
      },
      ratingsAverage: {
         type: Number,
         default: 4.5,
         set: (val) => Math.round(val * 10) / 10,
      },
      ratingsQuantity: {
         type: Number,
         default: 0,
      },
      price: {
         type: Number,
         required: [true, 'A tour must have a price'],
      },
      priceDiscount: {
         type: Number,
         min: 0,
         max: 100,
      },
      summary: {
         type: String,
         trim: true,
         required: [true, 'A tour must have a description'],
      },
      description: {
         type: String,
         trim: true,
      },
      imageCover: {
         type: String,
         required: [true, 'A tour must have a cover image'],
      },
      images: [String],
      createdAt: {
         type: Date,
         default: Date.now(),
         select: false,
      },
      startDates: [
         {
            type: Date,
            required: [true, 'A tour must have startDates'],
         },
      ],
      startDestination: {
         type: String,
         required: [true, 'A tour must have startDestination'],
      },
      endDestination: {
         type: String,
         required: [true, 'A tour must have endDestination'],
      },
      distance: {
         type: Number,
         required: [true, 'A tour must have distance'],
      },
      guides: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
         },
      ],
   },

   {
      toJSON: {
         virtuals: true,
      },
      toObject: {
         virtuals: true,
      },
   },
);

tourSchema.pre('save', function (next) {
   this.slug = slugify(this.name, {lower: true});

   next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
