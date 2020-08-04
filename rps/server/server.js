const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const RpsGame = require('./rps-game');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;
let playerNumber = 1;
let players = [];
let roleByID = [];
let role = ['Factory','Distributor','Wholesaler','Retailer']

io.on('connection', (sock) => {
  waitingPlayer = sock;
  waitingPlayer.emit('message', 'You are player '+playerNumber);
  players[playerNumber] = waitingPlayer
  roleByID[sock.id] = role[playerNumber-1]
  if (playerNumber == 4) {
    new RpsGame(players[1],players[2],players[3],players[4]);
    waitingPlayer = null;
    playerNumber = 1;
    players = []
  } else {
    playerNumber+=1
  }

  sock.on('message', (text) => {
    io.emit('message',roleByID[sock.id]+" : "+ text);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('RPS started on 8080');
});