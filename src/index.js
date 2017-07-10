import 'pixi'
import 'p2'
import Phaser from 'phaser'
import Main from './states/main';

class Game extends Phaser.Game {
  constructor() {
    super(800, 600, Phaser.AUTO,'');
    this.state.add('Main', Main, false);

    this.state.start('Main');
  }
}

window.game = new Game()
