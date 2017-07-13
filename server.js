var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8081,function(){
  log('Listening on '+server.address().port);
});

server.lastPlayerID = 0; // Keep track of the last id assigned to a new player

io.on('connection', function (socket) {
  socket.on('register', function () {
    socket.player = {
      id: server.lastPlayerID++,
      x: randomInt(100, 400),
      y: randomInt(100, 400)
    };
    socket.broadcast.emit('newPlayer', socket.player);
    socket.emit('allPlayers', getAllPlayers());
  });
  socket.on('move', function(direction){
    var data = {'direction': direction, 'id': socket.player.id}
    io.sockets.emit('playerMoved', data);
  });
  socket.on('fire', function(){
    io.sockets.emit('playerShoot', socket.player.id);
  });
});

function getAllPlayers() {
  var players = [];
  Object.keys(io.sockets.connected).forEach(function (socketID) {
    var player = io.sockets.connected[socketID].player;
    if (player) players.push(player);
  });
  return players;
}

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function log(msg) {
  console.log(msg);
}
