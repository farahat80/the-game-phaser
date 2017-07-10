import Game from '../states/main';

var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
  Client.socket.emit('newplayer');
};

Client.socket.on('allplayers',function(data){
  console.log(data);
  for(var i = 0; i < data.length; i++){
    Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
  }
});
