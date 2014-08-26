var http = require('http');
var socketio = require('socket.io');
var sockets

var httpServer = http.createServer(function(req, res){
  res.writeHead(404, "NOT FOUND");
  res.end();
});

var socketIOServer = socketio(httpServer);

var broadcastMessage = function(message) {
  console.log("Broadcasting message to " + socketIOServer.sockets.sockets.length + " clients");
  socketIOServer.sockets.emit('message', message);
};

socketIOServer.on('connection', function(socket) {
  socket.on('subscribe', function(name) {
    socket.name = name;
    console.log('Got subscription from ' + name);
    broadcastMessage({
      from: "Server",
      text: name + " joined the chat!"
    });    
  });
  socket.on('message', function(message) {
    console.log("Received message: " + JSON.stringify(message));
    broadcastMessage(message);
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