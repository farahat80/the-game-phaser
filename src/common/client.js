import Game from '../states/main';
import io from 'socket.io/node_modules/socket.io-client';

var Client = {};
Client.socket = io.connect('http://localhost:8081');

Client.askNewPlayer = function(){
  Client.socket.emit('newplayer');
};

Client.socket.on('allplayers',function(data){
  console.log(data);
  for(var i = 0; i < data.length; i++){
    Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
  }
});
