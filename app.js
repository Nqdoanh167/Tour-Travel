/** @format */

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');

const cookieParser = require('cookie-parser');
const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');
const reviewRoute = require('./routes/reviewRoute');
const bookingRoute = require('./routes/bookingRoute');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
dotenv.config();
const cors = require('cors');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

//read data from body
app.use(express.json());
app.use(cookieParser());
// Apply Cors middleware
app.use(cors());
//route
app.use('/api/v1/tour', tourRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/booking', bookingRoute);

// handle error route
app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
//connect database
const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB).then(() => {
   console.log('DB connection successfully!');
});

// liten port
const port = process.env.PORT || 8080;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
