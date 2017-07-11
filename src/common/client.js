import io from '../../node_modules/socket.io-client';
import Player from './player';

export default class Client {
  constructor(game, port) {
    const server = `http://localhost:${port}`;
    this.game = game;
    this.socket = io.connect(server);
    this.socket.on('allplayers', this.getAllPlayers.bind(this));
  }
  askNewPlayer() {
    this.socket.emit('newplayer');
  }
  getAllPlayers(data) {
    let self = this;
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      self.addNewPlayer(data[i].id, data[i].x, data[i].y);
    }
  }
  addNewPlayer(id, x, y) {
    let keyboard = this.game.input.keyboard.createCursorKeys();
    this.game.playerMap[id] = new Player(this.game, keyboard, x, y, 'dude');
  }
}
