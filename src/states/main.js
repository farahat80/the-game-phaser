import Player from '../common/player';
import Client from '../common/client';

class Main extends Phaser.State {
  constructor() {
    super();
    this.platforms = null;
  }
  init() {
    this.game.stage.disableVisibilityChange = true;
    this.client = new Client(this.game, '8081');
    this.keyboard = this.game.input.keyboard.createCursorKeys();
  }
  preload() {
    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  }
  create() {
    this.game.playerMap = {};
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.add.sprite(0, 0, 'sky');
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;
    var ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
    ground.scale.setTo(2, 1);
    ground.body.immovable = true;
    var ledge = this.platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = this.platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    this.keyboard = this.game.input.keyboard.createCursorKeys();
    this.client.register();
  }
  update() {
    let self = this;
    let players = this.game.playerMap;
    let currentPlayer = players[this.game.playerId];
    if (currentPlayer) {
      for (let id in players) {
        if (players.hasOwnProperty(id)) {
          self.game.physics.arcade.collide(players[id], self.platforms);
          players[id].changeVelocity('x', 0);
        }
      }
      if (this.keyboard.left.isDown) {
        currentPlayer.move('left', 150);
      }
      else if (this.keyboard.right.isDown) {
        currentPlayer.move('right', 150);
      }
      else {
        currentPlayer.stop();
      }
      if (this.keyboard.up.isDown && currentPlayer.isTouchingDown()) {
        currentPlayer.move('up', 350);
      }
      this.client.move(this.game.player);
    }
  }
}

export default Main;
