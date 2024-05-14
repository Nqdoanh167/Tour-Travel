/** @format */

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');

const cookieParser = require('cookie-parser');
const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');
const reviewRoute = require('./routes/reviewRoute');
const bookingRoute = require('./routes/bookingRoute');
const conversationRoute = require('./routes/conversationRoute');
const messageRoute = require('./routes/messageRoute');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
dotenv.config();
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});
app.use(express.static(path.join(__dirname, 'public')));
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
app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
//connect database
const DB = process.env.DATABASE_CLOUD;
mongoose.connect(DB).then(() => {
   console.log('DB connection successfully!');
});

//socket
const {Server} = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
   cors: {
      origin: process.env.URL_CLIENT,
   },
});

let onlineUsers = [];
io.on('connection', (socket) => {
   console.log('Socket connection successfully!');
   socket.on('addNewUser', (userId) => {
      if (userId) {
         console.log('onlineUsers', onlineUsers);
         console.log('userId', userId);
         const checkLogout = onlineUsers.some((user) => user.userId === userId);
         if (checkLogout) {
            console.log('logout');
            io.emit('logout', userId);
         } else {
            onlineUsers.push({
               userId,
               socketId: socket.id,
            });
            io.emit('getOnlineUsers', onlineUsers);
         }
      }
   });
   socket.on('sendMessage', (message) => {
      const user = onlineUsers.filter((userOnline) => userOnline.userId === message.receiveId);
      if (user) {
         io.to(user[0]?.socketId).emit('getMessage', message);
      }
   });
   socket.on('sendUpdateStateMess', (receiveId) => {
      io.emit('updateStateMess', receiveId);
   });
   socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit('getOnlineUsers', onlineUsers);
   });
});

// liten port
const port = process.env.PORT || 8080;
server.listen(port, () => {
   console.log(`Server running on port ${port}...`);
});
