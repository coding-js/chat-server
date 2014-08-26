var http = require('http');
var socketio = require('socket.io');

var httpServer = http.createServer(function(req, res){
  res.writeHead(404, "NOT FOUND");
  res.end();
});

var socketIOServer = socketio(httpServer);

socketIOServer.on('connection', function(socket) {
  socket.on('subscribe', function(name) {
    socket.emit('message', 'hello ' + name + "!");    
  });
});

httpServer.listen(3030, function() {
  console.log("Listening on port 3030");
});