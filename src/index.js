import 'pixi'
import 'p2'
import Phaser from 'phaser'
import io from '../node_modules/socket.io-client';


var sprite, weapon, cursors, fireButton, game;
var players = [];
///////////////////////////the client///////////////////////////////////////////
var client = {}
function connect() {
  client.socket = io.connect('http://localhost:8081');
  client.socket.on('allExistingPlayers', getExistingPlayers);
  client.socket.on('registered', registerPlayer);
}

///////////////////////////////////////////////////////////////////////////////
//////////      The game
///////////////////////////////////////////////////////////////////////////////
game = new Phaser.Game(800, 600, Phaser.AUTO, '',
  {
    preload: preload,
    create: create,
    update: update,
    render: render
  }
);
///////////////////////////////////////////////////////////////////////////////
function preload() {
  game.load.image('bullet', 'assets/shmup-bullet.png');
  game.load.image('ship', 'assets/thrust_ship.png');
}
///////////////////////////////////////////////////////////////////////////////
function create() {
  //  Creates 30 bullets, using the 'bullet' graphic
  weapon = game.add.weapon(30, 'bullet');
  //  The bullet will be automatically killed when it leaves the world bounds
  weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  //  The speed at which the bullet is fired
  weapon.bulletSpeed = 600;
  //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
  weapon.fireRate = 100;
  
  //  Tell the Weapon to track the 'player' Sprite
  //  With no offsets from the position
  //  But the 'true' argument tells the weapon to track sprite rotation
  cursors = this.input.keyboard.createCursorKeys();
  fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  connect();
  client.socket.emit('register');
}
///////////////////////////////////////////////////////////////////////////////
function update() {
  if (sprite) {
    if (cursors.up.isDown) {
      game.physics.arcade.accelerationFromRotation(sprite.rotation, 300, sprite.body.acceleration);
    }
    else {
      sprite.body.acceleration.set(0);
    }
    if (cursors.left.isDown) {
      sprite.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown) {
      sprite.body.angularVelocity = 300;
    }
    else {
      sprite.body.angularVelocity = 0;
    }
    if (fireButton.isDown) {
      weapon.fire();
    }
    game.world.wrap(sprite, 16);
  }
}
///////////////////////////////////////////////////////////////////////////////
function render() {
  //weapon.debug();
}
///////////////////////////////////////////////////////////////////////////////
function registerPlayer(data) {
  sprite = game.add.sprite(data.x, data.y, 'ship');
  sprite.anchor.set(0.5);
  game.physics.arcade.enable(sprite);
  sprite.body.drag.set(70);
  sprite.body.maxVelocity.set(200);
  weapon.trackSprite(sprite, 0, 0, true);
}
///////////////////////////////////////////////////////////////////////////////
function getExistingPlayers(data) {
  data.forEach(function (player) {
    game.add.sprite(player.x, player.y, 'ship');
  })
}