export default class Player{
  constructor(gameObj, controls, x, y, spriteName) {
    this.game = gameObj;
    this.x = x;
    this.y = y;
    this.sprite = spriteName;
    this.player = null;
    this.controls = controls
    this.createPlayer();
  }
  createPlayer() {
    let player = this.game.add.sprite(this.x, this.y, this.sprite);
    this.game.physics.arcade.enable(player);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    this.player = player;
  }
  update() {
    if (this.controls.left.isDown)
    {
      this.move('left', 150);
    }
    else if (this.controls.right.isDown)
    {
      this.move('right', 150);
    }
    else
    {
      this.stop();
    }
    if (this.controls.up.isDown && this.isTouchingDown())
    {
      this.move('up', 350);
    }
  }
  changeVelocity(axis, speed) {
    this.player.body.velocity[axis] = speed;
  }
  animate(direction) {
    this.player.animations.play(direction);
  }
  move(direction, speed) {
    switch (direction) {
      case 'right':
        this.changeVelocity('x', speed);
        break;
      case 'left':
        this.changeVelocity('x', -speed);
        break;
      case 'up':
        this.changeVelocity('y', -speed);
        break;
    }
    this.animate(direction);
  }
  stop() {
    this.player.animations.stop();
    this.player.frame = 4;
  }
  isTouchingDown() {
    return this.player.body.touching.down
  }

}