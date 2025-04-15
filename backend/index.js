// websocket-server/index.js

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var uniqid = require('uniqid');
const GameService = require('./services/game.service');

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------
let games = [];
let queue = [];

// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------

const newPlayerInQueue = (socket) => {

  queue.push(socket);

  // Queue management
  if (queue.length >= 2) {
    const player1Socket = queue.shift();
    const player2Socket = queue.shift();
    createGame(player1Socket, player2Socket);
  }
  else {
    socket.emit('queue.added', GameService.send.forPlayer.viewQueueState());
  }
};

const createGame = (player1Socket, player2Socket) => {

  const newGame = GameService.init.gameState();
  newGame['idGame'] = uniqid();
  newGame['player1Socket'] = player1Socket;
  newGame['player2Socket'] = player2Socket;

  games.push(newGame);

  const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);

  games[gameIndex].player1Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', games[gameIndex]));
  games[gameIndex].player2Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:2', games[gameIndex]));
};

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------

io.on('connection', socket => {
  console.log(`[${socket.id}] socket connected`);

  socket.on('queue.join', () => {
    console.log(`[${socket.id}] new player in queue `)
    newPlayerInQueue(socket);
  });

  socket.on('disconnect', reason => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });

  socket.on('game.cancel', () => {
    const game = findGameBySocket(socket);

    if (game) {
      const otherPlayerSocket = (game.player1Socket.id === socket.id)
        ? game.player2Socket
        : game.player1Socket;

      // Notify the other player
      otherPlayerSocket.emit('game.cancelled', {
        message: 'Your opponent has left the game.'
      });

      // Remove the game from the list
      games = games.filter(g => g.idGame !== game.idGame);

      console.log(`[${socket.id}] cancelled game ${game.idGame}`);
    }
  });

});

io.on('disconnect', reason => {
  console.log(`[${socket.id}] socket disconnected - ${reason}`);

  // Handle cancel logic on disconnect
  const game = findGameBySocket(socket);

  if (game) {
    const otherPlayerSocket = (game.player1Socket.id === socket.id)
      ? game.player2Socket
      : game.player1Socket;

    otherPlayerSocket.emit('game.cancelled', {
      message: 'Your opponent has disconnected.'
    });

    games = games.filter(g => g.idGame !== game.idGame);

    console.log(`[${socket.id}] disconnected from game ${game.idGame}`);
  }

  // Remove from queue if they were still waiting
  queue = queue.filter(s => s.id !== socket.id);
});

const findGameBySocket = (socket) => {
  return games.find(game =>
    game.player1Socket.id === socket.id || game.player2Socket.id === socket.id
  );
};

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get('/', (req, res) => res.sendFile('index.html'));

http.listen(3000, function () {
  console.log('listening on *:3000');
});
