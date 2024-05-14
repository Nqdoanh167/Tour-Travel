"use strict";

/** @format */

var express = require('express');
var http = require('http');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var tourRoute = require('./routes/tourRoute');
var userRoute = require('./routes/userRoute');
var reviewRoute = require('./routes/reviewRoute');
var bookingRoute = require('./routes/bookingRoute');
var conversationRoute = require('./routes/conversationRoute');
var messageRoute = require('./routes/messageRoute');
var globalErrorHandler = require('./controllers/errorController');
var AppError = require('./utils/appError');
dotenv.config();
var cors = require('cors');
var app = express();
app.use(cors());
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use(express["static"](path.join(__dirname, 'public')));
app.use(morgan('dev'));

//read data from body
app.use(express.json());
app.use(cookieParser());

//route
app.use('/api/v1/tour', tourRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/conversation', conversationRoute);
app.use('/api/v1/message', messageRoute);

// handle error route
app.all('*', function (req, res, next) {
  next(new AppError("Can't find ".concat(req.originalUrl, " on this server"), 404));
});
app.use(globalErrorHandler);
//connect database
var DB = process.env.DATABASE_CLOUD;
mongoose.connect(DB).then(function () {
  console.log('DB connection successfully!');
});

//socket
var _require = require('socket.io'),
  Server = _require.Server;
var server = http.createServer(app);
var io = new Server(server, {
  cors: {
    origin: process.env.URL_CLIENT
  }
});
var onlineUsers = [];
io.on('connection', function (socket) {
  console.log('Socket connection successfully!');
  socket.on('addNewUser', function (userId) {
    if (userId) {
      console.log('onlineUsers', onlineUsers);
      console.log('userId', userId);
      var checkLogout = onlineUsers.some(function (user) {
        return user.userId === userId;
      });
      if (checkLogout) {
        console.log('logout');
        io.emit('logout', userId);
      } else {
        onlineUsers.push({
          userId: userId,
          socketId: socket.id
        });
        io.emit('getOnlineUsers', onlineUsers);
      }
    }
  });
  socket.on('sendMessage', function (message) {
    var user = onlineUsers.filter(function (userOnline) {
      return userOnline.userId === message.receiveId;
    });
    if (user) {
      var _user$;
      io.to((_user$ = user[0]) === null || _user$ === void 0 ? void 0 : _user$.socketId).emit('getMessage', message);
    }
  });
  socket.on('sendUpdateStateMess', function (receiveId) {
    io.emit('updateStateMess', receiveId);
  });
  socket.on('disconnect', function () {
    onlineUsers = onlineUsers.filter(function (user) {
      return user.socketId !== socket.id;
    });
    io.emit('getOnlineUsers', onlineUsers);
  });
});

// liten port
var port = process.env.PORT || 8080;
server.listen(port, function () {
  console.log("Server running on port ".concat(port, "..."));
});