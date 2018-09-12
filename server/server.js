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

  socket.emit('newMessage', {
    from: 'haig',
    text: 'Dont forget to hit that like and subscribe button',
    createdAt: 350
  });

  socket.on('createMessage', (newMessage) => {
    console.log('Create Message: ', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('Client has Disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});
