var http = require('http');
var socketio = require('socket.io');
var sockets

var httpServer = http.createServer(function(req, res){
  res.writeHead(404, "NOT FOUND");
  res.end();
});

var socketIOServer = socketio(httpServer);

var rooms = [
  "The purple room",
  "The blue room",
  "The red room"
];

var broadcastMessage = function(room, message) {
  console.log("Broadcasting message to " + socketIOServer.sockets.sockets.length + " clients");
  socketIOServer.sockets.in(room).emit('message', message);
};

socketIOServer.on('connection', function(socket) {
  socket.on('subscribe', function(name) {
    socket.name = name;
    console.log('Got subscription from ' + name);
    socket.emit('rooms', rooms);
  });
  socket.on('join', function(message) {
    console.log(socket.name + " joined room: " + message.room);
    if (socket.currentRoom) {
      socket.leave(socket.currentRoom);
    }
    socket.currentRoom = message.room;
    socket.join(message.room);
    broadcastMessage(message.room, {
      from: "Server",
      text: socket.name + " joined " + socket.currentRoom
    });    
  });
  socket.on('leave', function(message) {
    socket.leave(message.room);
  });
  socket.on('message', function(message) {
    console.log("Received message: " + JSON.stringify(message));
    broadcastMessage(socket.currentRoom, message);
  });
  socket.on('disconnect', function() {
    console.log(socket.name + " disconnected");
    broadcastMessage({
      from: "Server",
      text: socket.name + " left the chat!"
    });
  });
});

httpServer.listen(3030, function() {
  console.log("Listening on port 3030");
});