const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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

  socket.on('createMessage', (message) => {
    console.log('Create Message: ', message);
    // Socket.emit emits to one socket
    // io.emit emits to every socket
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('Client has Disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});
