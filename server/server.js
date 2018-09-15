const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server); // web socket server

// Pathname to talk to public folder
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// register event listener
// connection = listen for new connection
io.on('connection', (socket) => {
  console.log('New User Connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App!'));

  // emits to every user except who fires the event
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User has Joined!'));

  socket.on('createMessage', (message, callback) => {
    console.log('Create Message: ', message);
    // Socket.emit emits to one socket
    // io.emit emits to every socket
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');
  });

  socket.on('disconnect', () => {
    console.log('Client has Disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});
