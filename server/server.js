const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server); // web socket server
let users = new Users();

// Pathname to talk to public folder
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// register event listener
// connection = listen for new connection
io.on('connection', (socket) => {
  console.log('New User Connected');

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and Room name are Required');
    }

    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App!'));
    // emits to every user except who fires the event
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the Room!`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('Create Message: ', message);
    // Socket.emit emits to one socket
    // io.emit emits to every socket
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    //io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has disconnected`));
    }
  });
});

server.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});
