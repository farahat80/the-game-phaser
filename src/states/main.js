import Player from '../common/player';

class Main extends Phaser.State {
  constructor() {
    super()
    this.platforms = null;
  }
  preload() {
    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  }
  create() {
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

    let p1Controls = this.game.input.keyboard.createCursorKeys();
    let p2Controls = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    }
    
    this.p1 = new Player(this.game, p1Controls, 32, this.game.world.height - 150, 'dude');
    this.p2 = new Player(this.game, p2Controls, 100, this.game.world.height - 150, 'dude');

  }

  update() {
    this.game.physics.arcade.collide(this.p1.player, this.platforms);
    this.game.physics.arcade.collide(this.p2.player, this.platforms);
    this.p1.changeVelocity('x', 0);
    this.p2.changeVelocity('x', 0);

    this.p1.update();
    this.p2.update();
    
    // ///////// player 2
    // if (this.leftButton.isDown)
    // {
    //   this.p2.move('left', 150);
    // }
    // else if (this.rightButton.isDown)
    // {
    //   this.p2.move('right', 150);
    // }
    // else
    // {
    //   this.p2.stop();
    // }
    // if (this.upButton.isDown && this.p2.isTouchingDown())
    // {
    //   this.p2.move('up', 350);
    // }

  }
}

export default Main;