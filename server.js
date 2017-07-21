var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

const NORTH = 'north';
const SOUTH = 'south';
const EAST = 'east';
const WEST = 'west';
const DIR_MAP = [NORTH, EAST, SOUTH, WEST];

server.listen(process.env.PORT || 8081,function(){
  log('Listening on '+server.address().port);
});

server.lastPlayerID = 0; // Keep track of the last id assigned to a new player

io.on('connection', function (socket) {
  socket.on('register', function () {
    socket.player = {
      id: server.lastPlayerID++,
      direction: randomDirection(),
      x: randomInt(200, 400),
      y: randomInt(200, 400)
    };
    socket.broadcast.emit('newPlayer', socket.player);
    socket.emit('allPlayers', getAllPlayers());
  });
  socket.on('rotate', function(direction){
    var current_direction = socket.player.direction;
    socket.player.direction = changeDirection(current_direction, direction);
    io.sockets.emit('playerRotated', socket.player);
  });
  socket.on('disconnect',function(){
    socket.broadcast.emit('removePlayer', socket.player.id);
  });

  setInterval(function(){ 
    io.sockets.emit('allPlayersMove', moveAllPlayers());
  }, 500);
});

function changeDirection(current_direction, direction) {
  switch(direction){
    case "left": 
      return nextDirection(current_direction);
    case "right":
      return previousDirection(current_direction);
  }
}

function movePlayer(player){
  switch(player.direction){
    case NORTH:
      player.y += 10;
      break;
    case SOUTH:
      player.y -= 10;
      break;
    case EAST:
      player.x += 10;
      break;
    case WEST:
      player.x -= 10;
      break;
  }
}

function moveAllPlayers(){
  var players = [];
  Object.keys(io.sockets.connected).forEach(function (socketID) {
    var player = io.sockets.connected[socketID].player;
    if(player){
      movePlayer(player);
      players.push(player);
    }
  });
  return players;
}

function nextDirection(direction){
  var len = DIR_MAP.length;
  var currentIndex = DIR_MAP.indexOf(direction);
  var nextIndex = (currentIndex+1)%len;
  return DIR_MAP[nextIndex];
}

function previousDirection(direction){
  var len = DIR_MAP.length;
  var currentIndex = DIR_MAP.indexOf(direction);
  var previousIndex = (((currentIndex-1)%len)+len)%len;
  return DIR_MAP[previousIndex];
}

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

function randomDirection() {
    var directions = [NORTH, SOUTH, EAST, WEST];
    return directions[Math.floor(Math.random() * 4)];
}

function log(msg) {
  console.log(msg);
}
