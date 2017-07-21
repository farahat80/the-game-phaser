import 'pixi'
import 'p2'
import Phaser from 'phaser'
import io from '../node_modules/socket.io-client';

const NORTH = 'north';
const SOUTH = 'south';
const EAST = 'east';
const WEST = 'west';

var DIR_TO_ANGLE = {};
DIR_TO_ANGLE[NORTH] =  90; 
DIR_TO_ANGLE[SOUTH] = -90;
DIR_TO_ANGLE[EAST] = 0;
DIR_TO_ANGLE[WEST] = -180;

var cursors, game;
var players = {};
///////////////////////////the client///////////////////////////////////////////
var client = {}
function connect() {
  client.socket = io.connect('http://localhost:8081');
  client.socket.on('newPlayer', addNewPlayer);
  client.socket.on('allPlayers', addAllPlayers);
  client.socket.on('playerRotated', rotatePlayer);
  client.socket.on('allPlayersMove', moveAllPlayers);
  client.socket.on('removePlayer', removePlayer);
}

///////////////////////////////////////////////////////////////////////////////
//////////      The game
///////////////////////////////////////////////////////////////////////////////
game = new Phaser.Game(800, 600, Phaser.AUTO, '',
  {
    init: init,
    preload: preload,
    create: create,
    update: update,
    render: render
  }
);
///////////////////////////////////////////////////////////////////////////////
function init() {
    game.stage.disableVisibilityChange = true;
}
///////////////////////////////////////////////////////////////////////////////
function preload() {
  game.load.image('ship', 'assets/thrust_ship.png');
}
///////////////////////////////////////////////////////////////////////////////
function create() {
  cursors = this.input.keyboard.createCursorKeys();

  connect();
  client.socket.emit('register');

  cursors.left.onDown.add(function(){
    client.socket.emit('rotate', 'left');
  });
  cursors.right.onDown.add(function(){
    client.socket.emit('rotate', 'right');
  });
}
///////////////////////////////////////////////////////////////////////////////
function update() {
  // Not yet
}

///////////////////////////////////////////////////////////////////////////////
function render() {
  // Not yet
}

///////////////////////////////////////////////////////////////////////////////
function addNewPlayer(data) {
  var sprite = game.add.sprite(data.x, data.y, 'ship');
  var angle = DIR_TO_ANGLE[data.direction];

  sprite.anchor.set(0.5);
  game.physics.arcade.enable(sprite);
  sprite.body.immovable = false;
  sprite.body.collideWorldBounds = true;
  sprite.angle = angle;

  players[data.id] = sprite;
}

///////////////////////////////////////////////////////////////////////////////
function addAllPlayers(allPlayers) {
  allPlayers.forEach(function(data) {
    addNewPlayer(data);
  });
}

///////////////////////////////////////////////////////////////////////////////
function moveAllPlayers(allPlayers) {
  allPlayers.forEach(function(data) {
    movePlayer(data);
  });
}

///////////////////////////////////////////////////////////////////////////////
function movePlayer(playerData) {
  var sprite = players[playerData.id];

  game.physics.arcade.moveToXY(sprite, playerData.x, playerData.y, 100, 500);
}

///////////////////////////////////////////////////////////////////////////////
function rotatePlayer(playerData) {
  var sprite = players[playerData.id];
  var angle = DIR_TO_ANGLE[playerData.direction];
  
  sprite.angle = angle;
}
///////////////////////////////////////////////////////////////////////////////
function removePlayer(id) {
  players[id].sprite.destroy();

  delete players[id];
}
