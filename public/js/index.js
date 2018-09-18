let socket = io();

socket.on('connect', function(){
  console.log('Connected to Server');
});

socket.on('disconnect', function(){
  console.log('Disconnected from Server');
});

socket.on('newMessage', function(message){
  let formattedTime = moment(message.createdAt).format('h:mm a');

  //console.log('New Message: ', message);
  let li = jQuery('<li></li>');
  li.text(`${message.from} [${formattedTime}]: ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
  let formattedTime = moment(message.createdAt).format('h:mm a');

  let li = jQuery('<li></li>');
  let a = jQuery('<a target="_blank">My Current Location</a>');

  li.text(`${message.from} [${formattedTime}]: `);
  a.attr('href', message.url);
  li.append(a);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  let messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function(){
    messageTextBox.val(''); //clears chat box when done
  });
});

let locationButton = jQuery('#send-location');
locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
    alert('Unable to fetch location');
    locationButton.removeAttr('disabled').text('Send Location');
  });
});
