var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/dist', express.static(__dirname + '/dist'));

server.listen(process.env.PORT || 8081,function(){
  console.log('Listening on '+server.address().port);
});

server.lastPlayerID = 0; // Keep track of the last id assigned to a new player

io.on('connection', function (socket) {
  socket.emit('allExistingPlayers', getAllPlayers());

  socket.on('register', function () {
    socket.player = {
      id: server.lastPlayerID++,
      x: randomInt(100, 400),
      y: randomInt(100, 400)
    };
    socket.broadcast.emit('newPlayer', socket.player);
    socket.emit('registered', socket.player);
  });

  socket.on('move', function(newPlayerData){
    socket.player.x = newPlayerData.x;
    socket.player.y = newPlayerData.y;

    socket.emit('playerMoved', socket.player);
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
