const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const moment = require('moment');
const port = 2000;
const cors = require('cors');
const schedule = require('node-schedule');
const bearerToken = require('express-bearer-token');
const { userJoin, userLeave, getRoomUsers, userTopup } = require('./utils/users');

app.use(bodyParser());
app.use(bearerToken());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.io = io;

app.get('/', (req, res) => {
  res.status(200).send('<h1>Welcome To Susilobid API</h1>');
});

//=============== SOCKET.IO START ==================

// Run when user connects
io.on('connection', socket => {

  //server time
  schedule.scheduleJob('* * * * * *', () => {
    let time = moment().format('DD MMMM YYYY, HH:mm');
    
    socket.emit('time', time);
  });

  // create room
  socket.on('joinRoom', ({ username, productId }) => {

    const user = userJoin(socket.id, username, productId);
    
    socket.join(user.room);

    // Welcome current user
    socket.emit('message', 'Welcome to SusiloBid!');
  
    // Broadcast when a user connects
    if (user.username) {
      socket.broadcast.to(user.room).emit('message', `${user.username} has joined room`);
    }
    
    // Send users in room info
    io.to(user.room).emit('roomUsers', {
      users: getRoomUsers(user.room)
    });
  });

  // Runs when user disconnects
  socket.on('disconnect', () => {
    
    const user = userLeave(socket.id);
    
    if (user) {
      io.to(user.room).emit('message', `${user.username} has left the room`);
      
      // Send users in room info
      io.to(user.room).emit('roomUsers', {
        users: getRoomUsers(user.room)
      });
    }
  });
});

//=============== SOCKET.IO END ==================

//=============== GET SERVER TIME START ==================
app.get('/get-server-time', (req, res) => {
  try {
    let time = moment().format('DD MMMM YYYY, HH:mm');
    res.status(200).send(time);
  } catch(err) {
    res.status(500).send(err.message);
  };
});
//=============== GET SERVER TIME END =====================

const {
  authRouter,
  manageUserRouter,
  manageSellerRouter,
  setBiddingRouter,
  productRouter,
  biddingRouter,
  paymentRouter,
  walletRouter,
  reportRouter,
  profileRouter,
  bidRouter,
  cartRouter,
  postProductRouter
} = require('./router');

app.use('/users', authRouter);
app.use('/manage-users', manageUserRouter);
app.use('/manage-sellers', manageSellerRouter);
app.use('/set-bidding-room', setBiddingRouter);
app.use('/product', productRouter);
app.use('/bidding', biddingRouter);
app.use('/payment', paymentRouter);
app.use('/wallet', walletRouter);
app.use('/report', reportRouter);
app.use('/profile', profileRouter);
app.use('/bid', bidRouter);
app.use('/cart', cartRouter);
app.use('/seller',postProductRouter);

http.listen(port, () => console.log(`API active at port ${port}`));