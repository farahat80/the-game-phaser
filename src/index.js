import 'pixi'
import 'p2'
import Phaser from 'phaser'
import io from '../node_modules/socket.io-client';


var cursors, fireButton, game;
var gameOn = false;
var players = {};
///////////////////////////the client///////////////////////////////////////////
var client = {}
function connect() {
  client.socket = io.connect('http://localhost:8081');
  client.socket.on('newPlayer', addNewPlayer);
  client.socket.on('allPlayers', addAllPlayers);
  client.socket.on('playerMoved', movePlayer);
  client.socket.on('playerShoot', shootPlayer);
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
  game.load.image('bullet', 'assets/shmup-bullet.png');
  game.load.image('ship', 'assets/thrust_ship.png');
}
///////////////////////////////////////////////////////////////////////////////
function create() {
  cursors = this.input.keyboard.createCursorKeys();
  fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

  connect();
  client.socket.emit('register');
}
///////////////////////////////////////////////////////////////////////////////
function update() {
  if(gameOn){
    if (cursors.up.isDown) {
      client.socket.emit('move', 'forward');
    }
    else {
      client.socket.emit('move', 'stop');
    }

    if (cursors.left.isDown) {
      client.socket.emit('move', 'left');
    }
    else if (cursors.right.isDown) {
      client.socket.emit('move', 'right');
    }
    else {
      client.socket.emit('move', 'none');
    }

    if (fireButton.isDown) {
      client.socket.emit('fire');
    }
  }
}

///////////////////////////////////////////////////////////////////////////////
function render() {
  //weapon.debug();
}
///////////////////////////////////////////////////////////////////////////////
function addNewPlayer(data) {
  var sprite = game.add.sprite(data.x, data.y, 'ship');
  //  Creates 30 bullets, using the 'bullet' graphic
  var weapon = game.add.weapon(30, 'bullet');

  //  The bullet will be automatically killed when it leaves the world bounds
  weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  //  The speed at which the bullet is fired
  weapon.bulletSpeed = 600;
  //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
  weapon.fireRate = 100;

  sprite.anchor.set(0.5);
  game.physics.arcade.enable(sprite);
  sprite.body.drag.set(70);
  sprite.body.maxVelocity.set(200);
  //  Tell the Weapon to track the 'sprite'
  //  With no offsets from the position
  //  But the 'true' argument tells the weapon to track sprite rotation
  weapon.trackSprite(sprite, 0, 0, true);

  players[data.id] = {'sprite': sprite, 'weapon': weapon};
}
///////////////////////////////////////////////////////////////////////////////
function addAllPlayers(allPlayers) {
  allPlayers.forEach(function(data) {
    addNewPlayer(data);
  });
  gameOn = true;
}
///////////////////////////////////////////////////////////////////////////////
function movePlayer(data) {
  var direction = data['direction'];
  var sprite = players[data.id].sprite;

  switch(direction){
    case "forward":
      game.physics.arcade.accelerationFromRotation(sprite.rotation, 300, sprite.body.acceleration);
      break;
    case 'stop':
      sprite.body.acceleration.set(0);
      break;
    case 'left':
      sprite.body.angularVelocity = -300;
      break;
    case 'right':
      sprite.body.angularVelocity = 300;
      break;
    case 'none':
      sprite.body.angularVelocity = 0;
      break;
  }

  game.world.wrap(sprite, 16);
}
///////////////////////////////////////////////////////////////////////////////
function shootPlayer(id) {
  var weapon = players[id].weapon
  var sprite = players[id].sprite

  weapon.fire();

  game.world.wrap(sprite, 16);
}
///////////////////////////////////////////////////////////////////////////////
function removePlayer(id) {
  players[id].weapon.destroy();
  players[id].sprite.destroy();

  delete players[id];
}
