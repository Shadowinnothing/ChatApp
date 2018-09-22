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

  // reject user if name or room are not valid strings
  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and Room name are Required');
    }

    // reject users with same name as other user
    if(users.getUserName(params.name)){
      return callback(`User Name ${params.name} is already in use`);
    }

    socket.join(params.room);

    // remove user in case of duplicates
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    // emit current rooms
    socket.emit('currentRooms', users.getRoomList());

    // only emit messages to users room
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App!'));
    // emits to every user except who fires the event
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the Room!`));

    callback();
  });

  // sends a message to everyone in current room
  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
      // Socket.emit emits to one socket
      // io.emit emits to every socket
      // to() sends to specific socket
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  // send message with link to current location
  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  // disconnect user from page
  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has disconnected`));
    }
  });
});

// connects to PORT for app
// port is 3000 by default, but can be anything heroku tells it to be
server.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});
