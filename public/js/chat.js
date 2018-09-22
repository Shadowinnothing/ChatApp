let socket = io();

function scrollToBottom(){
  // selectors
  const messages = jQuery('#messages');
  const newMessage = messages.children('li:last-child');

  // heights
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if((clientHeight + scrollTop + newMessageHeight + lastMessageHeight) >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function(){
  console.log('Connected to Server');

  let params = jQuery.deparam(window.location.search);
  // convert room toUpperCase so people in rooms
  // 'PACKERS' and 'packers' go to same room
  // also does the same with the name property
  params.room = params.room.toUpperCase();
  params.name = params.name.toUpperCase();

  socket.emit('join', params, function(err){
    if(err){
      alert(err);
      window.location.href = '/';
    } else {
      console.log('[chat.js]No Error');
    }
  });

  // show room name on chat.html page
  let template = jQuery('#roomName').html();
  let _html = Mustache.render(template, {
    room: params.room
  });
  jQuery('#roomName').html(_html);
});

socket.on('disconnect', function(){
  console.log('Disconnected from Server');
});

socket.on('updateUserList', function(users){
  let ol = jQuery('<ol></ol>');

  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('newMessage', function(message){
  let formattedTime = moment(message.createdAt).format('h:mm a');

  let template = jQuery('#message-template').html();
  let _html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(_html);

  scrollToBottom();
});

socket.on('newLocationMessage', function(message){
  let formattedTime = moment(message.createdAt).format('h:mm a');

  let template = jQuery('#location-message-template').html();
  let _html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery('#messages').append(_html);

  scrollToBottom();
});

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  let messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
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
