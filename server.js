var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/game.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit("welcome");
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on("update", (day, hour, stamina, health, exp, wood, stone, food)=>{
    socket.emit("welcome");
    if(stamina<=0 || health<=0){
      socket.emit("gameover");
    }
    else if(Math.floor(Math.random()*15)==0){
      socket.emit("haiya");
      wood = Math.floor(wood/(3-(exp/600)));
      stone = Math.floor(wood/(3-(exp/600)));
      food = Math.floor(food/(3-(exp/600)));
    }
    if(day%7==0 && hour==6){
      socket.emit("ship");
    }
    if(exp>1000) exp = 1000;
    var lv = Math.floor(Math.random(exp/100));
    socket.emit("update", day, hour, stamina, health, lv, wood, stone, food);
  });
  socket.on("escape", ()=>{
    socket.emit("escape");
  })
});




