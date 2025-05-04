// websocket-server/index.js

const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
var uniqid = require('uniqid');
const GameService = require('./services/game.service');

app.use(cors());
app.use(express.json());

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------
let games = [];
let queue = [];

// ------------------------------------
// -------- EMITTER METHODS -----------
// ------------------------------------

const updateClientsViewTimers = (game) => {
  game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
  game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
};

const updateClientsViewDecks = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState));
    game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState));
  }, 200);
};

const updateClientsViewChoices = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:1', game.gameState));
    game.player2Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:2', game.gameState));
  }, 200);
}

const updateClientsViewGrid = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:1', game.gameState));
    game.player2Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:2', game.gameState));
  }, 200);
}

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

  updateClientsViewTimers(games[gameIndex]);
  updateClientsViewDecks(games[gameIndex]);
  updateClientsViewGrid(games[gameIndex]);

  // On execute une fonction toutes les secondes (1000 ms)
  const gameInterval = setInterval(() => {

    games[gameIndex].gameState.timer--;
    updateClientsViewTimers(games[gameIndex]);

    // Si le timer tombe à zéro
    if (games[gameIndex].gameState.timer === 0) {

      // On change de tour en inversant le clé dans 'currentTurn'
      games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';

      // Méthode du service qui renvoie la constante 'TURN_DURATION'
      games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();

      games[gameIndex].gameState.deck = GameService.init.deck();

      updateClientsViewTimers(games[gameIndex]);
      updateClientsViewDecks(games[gameIndex]);
    }

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

const removePlayerFromQueue = (playerSocket) => {
  queue.shift();
  playerSocket.emit('queue.left', GameService.send.forPlayer.viewLeaveQueueState());
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

  socket.on('queue.leave', () => {
    const wasInQueue = queue.some(s => s.id === socket.id);

    // Remove the socket from the queue
    queue = queue.filter(s => s.id !== socket.id);

    if (wasInQueue) {
      console.log(`[${socket.id}] left the queue`);
      socket.emit('queue.left', { message: 'You have left the queue.' });
    } else {
      socket.emit('queue.left', { message: 'You were not in the queue.' });
    }
  });


  socket.on('game.cancel', () => {
    const game = findGameBySocket(socket);

    if (game) {
      const otherPlayerSocket = (game.player1Socket.id === socket.id)
        ? game.player2Socket
        : game.player1Socket;

      // Reset game state
      game.gameState = GameService.init.gameState();

      // Notify the other player
      otherPlayerSocket.emit('game.cancelled', {
        message: 'Your opponent has left the game.'
      });

      // Remove the game from the list
      games = games.filter(g => g.idGame !== game.idGame);

      console.log(`[${socket.id}] cancelled game ${game.idGame}`);
    }
  });

  socket.on('game.dices.roll', () => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const lastTurn = games[gameIndex].gameState.deck.rollsCounter === games[gameIndex].gameState.deck.rollsMaximum;

    if (!lastTurn) {
      // gestion des dés 
      games[gameIndex].gameState.deck.dices = GameService.dices.roll(games[gameIndex].gameState.deck.dices);
      games[gameIndex].gameState.deck.rollsCounter++;

      // gestion des combinaisons ici

      // gestion des vues
      updateClientsViewDecks(games[gameIndex]);

    } else {
      // si c'est le dernier lancer

      // gestion des dés 
      games[gameIndex].gameState.deck.dices = GameService.dices.roll(games[gameIndex].gameState.deck.dices);
      games[gameIndex].gameState.deck.rollsCounter++;
      games[gameIndex].gameState.deck.dices = GameService.dices.lockEveryDice(games[gameIndex].gameState.deck.dices);

      // gestion des combinaisons ici

      games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
      updateClientsViewTimers(games[gameIndex]);
      updateClientsViewDecks(games[gameIndex]);
    }

    // combinations management
    const dices = [...games[gameIndex].gameState.deck.dices];
    const isDefi = false;
    const isSec = games[gameIndex].gameState.deck.rollsCounter === 2;
    const combinations = GameService.choices.findCombinations(dices, isDefi, isSec);

    // we affect changes to gameState
    games[gameIndex].gameState.choices.availableChoices = combinations;

    // emitters
    updateClientsViewChoices(games[gameIndex]);

    if (combinations.length === 0 && lastTurn) {
      // Aucun coup possible → fin de tour automatique
      const currentPlayer = games[gameIndex].gameState.currentTurn;

      // On change de joueur
      games[gameIndex].gameState.currentTurn = currentPlayer === 'player:1' ? 'player:2' : 'player:1';

      // On remet le timer
      games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
      updateClientsViewTimers(games[gameIndex]);

      // Nouveau deck
      games[gameIndex].gameState.deck = GameService.init.deck();
      updateClientsViewDecks(games[gameIndex]);

      // Reset des choix
      games[gameIndex].gameState.choices = GameService.init.choices();
      updateClientsViewChoices(games[gameIndex]);

      return; // On stoppe ici le handler
    }
  });

  socket.on('game.dices.lock', (idDice) => {

    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const indexDice = GameService.utils.findDiceIndexByDiceId(games[gameIndex].gameState.deck.dices, idDice);

    // reverse flag 'locked'
    games[gameIndex].gameState.deck.dices[indexDice].locked = !games[gameIndex].gameState.deck.dices[indexDice].locked;

    updateClientsViewDecks(games[gameIndex]);
  });

  socket.on('game.choices.selected', (data) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const game = games[gameIndex];

    // Save selected choice in game state
    game.gameState.choices.idSelectedChoice = data.choiceId;

    // Update grid with cells that can be clicked
    game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(
      data.choiceId,
      game.gameState.grid
    );

    // Update player score in 3 cell row or win game


    // Notify both players of updated choice and updated grid
    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
  });

  socket.on('game.grid.selected', (data) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const game = games[gameIndex];
    const currentPlayer = game.gameState.currentTurn;

    // Check if player has pions left
    if ((currentPlayer === 'player:1' && game.gameState.player1Pions <= 0) ||
        (currentPlayer === 'player:2' && game.gameState.player2Pions <= 0)) {
      return; // Player can't play if they have no pions left
    }

    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);
    game.gameState.grid = GameService.grid.selectCell(data.cellId, data.rowIndex, data.cellIndex, currentPlayer, game.gameState.grid);

    // Decrease pions count
    if (currentPlayer === 'player:1') {
      game.gameState.player1Pions--;
    } else {
      game.gameState.player2Pions--;
    }

    game.gameState = GameService.score.calculateScore(game.gameState);

    // Check for win conditions
    if (game.gameState.winner) {
      game.player1Socket.emit('game.over', { 
        winner: game.gameState.winner, 
        winType: game.gameState.winType 
      });
      game.player2Socket.emit('game.over', { 
        winner: game.gameState.winner, 
        winType: game.gameState.winType 
      });
      return;
    }

    // Check if a player has no more pions
    if (game.gameState.player1Pions === 0 || game.gameState.player2Pions === 0) {
      const winner = game.gameState.scores['player:1'] > game.gameState.scores['player:2'] ? 'player:1' : 'player:2';
      game.player1Socket.emit('game.over', { winner: winner, winType: 'noPions' });
      game.player2Socket.emit('game.over', { winner: winner, winType: 'noPions' });
      return;
    }

    game.gameState.currentTurn = currentPlayer === 'player:1' ? 'player:2' : 'player:1';
    game.gameState.timer = GameService.timer.getTurnDuration();

    game.gameState.deck = GameService.init.deck();
    game.gameState.choices = GameService.init.choices();

    // Emit updated game state to both players
    game.player1Socket.emit('game.state.update', {
        currentTurn: game.gameState.currentTurn,
        player1Score: game.gameState.player1Score,
        player2Score: game.gameState.player2Score,
        player1Pions: game.gameState.player1Pions,
        player2Pions: game.gameState.player2Pions,
        grid: game.gameState.grid,
        choices: game.gameState.choices,
        deck: game.gameState.deck
    });
    game.player2Socket.emit('game.state.update', {
        currentTurn: game.gameState.currentTurn,
        player1Score: game.gameState.player1Score,
        player2Score: game.gameState.player2Score,
        player1Pions: game.gameState.player1Pions,
        player2Pions: game.gameState.player2Pions,
        grid: game.gameState.grid,
        choices: game.gameState.choices,
        deck: game.gameState.deck
    });

    game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
    game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));

    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
  });

  socket.on('disconnect', reason => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);

    // Handle cancel logic on disconnect
    const game = findGameBySocket(socket);

    if (game) {
      const otherPlayerSocket = (game.player1Socket.id === socket.id)
        ? game.player2Socket
        : game.player1Socket;

      // Reset game state
      game.gameState = GameService.init.gameState();

      otherPlayerSocket.emit('game.cancelled', {
        message: 'Your opponent has disconnected.'
      });

      games = games.filter(g => g.idGame !== game.idGame);

      console.log(`[${socket.id}] disconnected from game ${game.idGame}`);
    }

    // Remove from queue if they were still waiting
    queue = queue.filter(s => s.id !== socket.id);
  });
});

io.on('disconnect', reason => {
  console.log(`[${socket.id}] socket disconnected - ${reason}`)

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

let users = []; // stockage temporaire en mémoire

app.post('/register', (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== 'string' || username.trim() === '') {
    return res.status(400).json({ error: 'Invalid username' });
  }

  const cleanUsername = username.trim();

  users.push(cleanUsername);
  console.log(`New user registered: ${cleanUsername}`);
  res.status(201).json({ message: 'Username registered successfully' });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
