// websocket-server/index.js
const cors = require('cors');

const app = require('express')();
app.use(cors());
const http = require('http').Server(app);

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
// const User = require('./models/user.model');

const io = require('socket.io')(http);
var uniqid = require('uniqid');
const GameService = require('./services/game.service');
// const mongoose = require("mongoose");
// require("dotenv").config();
const { readUsers, writeUsers } = require('./utils');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const db = mongoose.connect(
//   process.env.MONGODB_URI,
// );



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

  const gameInterval = setInterval(() => {
    games[gameIndex].gameState.timer--;

    // Si le timer tombe à zéro
    if (games[gameIndex].gameState.timer === 0) {

      // On change de tour en inversant le clé dans 'currentTurn'
      games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';

      // Méthode du service qui renvoie la constante 'TURN_DURATION'
      games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
    }

    // On notifie finalement les clients que les données sont mises à jour.
    games[gameIndex].player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', games[gameIndex].gameState));
    games[gameIndex].player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', games[gameIndex].gameState));
  }, 1000);

  // On prévoit de couper l'horloge
  // pour le moment uniquement quand le socket se déconnecte
  player1Socket.on('disconnect', () => {
    clearInterval(gameInterval);
  });

  player2Socket.on('disconnect', () => {
    clearInterval(gameInterval);
  });
};

const abortGame = (socket) => {
  const gameIndex = games.findIndex(game =>
    game.player1Socket.id === socket.id || game.player2Socket.id === socket.id
  );

  if (gameIndex !== -1) {
    const game = games[gameIndex];
    const opponentSocket = (game.player1Socket.id === socket.id)
      ? game.player2Socket
      : game.player1Socket;

    // Notify opponent if still connected
    if (opponentSocket && opponentSocket.connected) {
      opponentSocket.emit('game.aborted', {
        message: "Opponent left the game.",
        inGame: false,
        inQueue: false
      });
    }

    // Remove game from games array
    games.splice(gameIndex, 1);
    console.log(`[${socket.id}] aborted game [${game.idGame}]`);
  }
};

const leaveQueue = (socket) => {
  const index = queue.indexOf(socket);
  if (index !== -1) {
    queue.splice(index, 1); // Remove socket from queue
    socket.emit('queue.removed', GameService.send.forPlayer.viewQueueState());
    console.log(`[${socket.id}] left the queue`);
  } else {
    console.log(`[${socket.id}] tried to leave queue but was not in it`);
  }
}

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------
io.on('connection', socket => {
  console.log(`[${socket.id}] socket connected at ${new Date().toLocaleString()}`);

  socket.on('queue.join', () => {
    console.log(`[${socket.id}] new player in queue `)
    newPlayerInQueue(socket);
  });

  socket.on('queue.leave', () => {
    console.log(`[${socket.id}] requested to leave queue`);
    leaveQueue(socket);
  });

  socket.on('game.leave', () => {
    console.log(`[${socket.id}] requested to leave game`);
    abortGame(socket);
  })

  socket.on('disconnect', reason => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
    leaveQueue(socket);
    abortGame(socket); // 💥 Clean up the game if the player was in one
  });
});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get('/', (req, res) => res.sendFile('index.html'));

// Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const existingUser = users.find(u => u.username === username);

  if (existingUser) {
    return res.status(400).json({ message: "Username already taken." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "User registered successfully!" });
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  res.status(200).json({ message: "Login successful", username: user.username });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
