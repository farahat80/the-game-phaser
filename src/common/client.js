import io from '../../node_modules/socket.io-client';
import Player from './player';

export default class Client {
  constructor(game, port) {
    const server = `http://localhost:${port}`;
    this.game = game;

    this.socket = io.connect(server);
    this.socket.on('allExistingPlayers', this.registerPlayers.bind(this));
    this.socket.on('newPlayer', this.addPlayer.bind(this));
    this.socket.on('registered', function(playerData){
        this.addPlayer(playerData);
        this.game.player = playerData;
    }.bind(this));
    this.socket.on('playerMoved', this.movePlayer.bind(this));
  }
  register() {
    this.socket.emit('register');
  }
  move(playerData){
    this.socket.emit('move', playerData);
  }
  registerPlayers(data) {
    let self = this;
    for (var i = 0; i < data.length; i++) {
      self.addPlayer(data[i]);
    }
  }
  addPlayer(playerData) {
    let keyboard = this.game.input.keyboard.createCursorKeys();
    this.game.playerMap[playerData.id] = new Player(this.game, keyboard,
                                                    playerData.x, playerData.y,
                                                    'dude');
  }
  movePlayer(playerData) {
      this.game.playerMap[playerData.id].dumbMove(playerData.x, playerData.y);
  }
}
