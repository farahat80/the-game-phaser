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

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    // Here we create the ground.
    var ground = this.platforms.create(0, this.game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 1);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = this.platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = this.platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    this.client.askNewPlayer();
  }
  update() {
    if(this.keyboard.left.isDown){
      console.log("Left Down!");
    } else if(this.keyboard.right.isDown){
      console.log("Right Down!");
    } else if(this.keyboard.up.isDown){
      console.log("Up Down!");
    } else if(this.keyboard.down.isDown){
      console.log("Down Down!");
    }
  }
}

export default Main;
