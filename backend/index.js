const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST'],
  },
});

// Configure CORS for Express
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
}));

// Initialize game state
const gameState = {
  board: Array(25).fill(null),
  currentPlayer: 'A',
  moveHistory: [],
};

function initializeGame() {
  gameState.board = [
    'A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3',
    null, null, null, null, null,
    null, null, null, null, null,
    null, null, null, null, null,
    'B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3'
  ];
  gameState.currentPlayer = 'A';
  gameState.moveHistory = [];
}

function isValidMove(character, move, currentIndex) {
  const row = Math.floor(currentIndex / 5);
  const col = currentIndex % 5;

  if (character.includes('P')) {
    switch (move) {
      case 'L': return col > 0;
      case 'R': return col < 4;
      case 'F': return gameState.currentPlayer === 'A' ? row < 4 : row > 0;
      case 'B': return gameState.currentPlayer === 'A' ? row > 0 : row < 4;
    }
  } else if (character.includes('H1')) {
    switch (move) {
      case 'L': return col > 1;
      case 'R': return col < 3;
      case 'F': return gameState.currentPlayer === 'A' ? row < 3 : row > 1;
      case 'B': return gameState.currentPlayer === 'A' ? row > 1 : row < 3;
    }
  } else if (character.includes('H2')) {
    switch (move) {
      case 'FL': return (gameState.currentPlayer === 'A' ? row < 3 : row > 1) && col > 1;
      case 'FR': return (gameState.currentPlayer === 'A' ? row < 3 : row > 1) && col < 3;
      case 'BL': return (gameState.currentPlayer === 'A' ? row > 1 : row < 3) && col > 1;
      case 'BR': return (gameState.currentPlayer === 'A' ? row > 1 : row < 3) && col < 3;
    }
  }
  return false;
}

function makeMove(character, move) {
  const currentIndex = gameState.board.indexOf(character);
  if (currentIndex === -1 || !isValidMove(character, move, currentIndex)) {
    return false;
  }

  let newIndex;
  const row = Math.floor(currentIndex / 5);
  const col = currentIndex % 5;

  if (character.includes('P')) {
    switch (move) {
      case 'L': newIndex = currentIndex - 1; break;
      case 'R': newIndex = currentIndex + 1; break;
      case 'F': newIndex = gameState.currentPlayer === 'A' ? currentIndex + 5 : currentIndex - 5; break;
      case 'B': newIndex = gameState.currentPlayer === 'A' ? currentIndex - 5 : currentIndex + 5; break;
    }
  } else if (character.includes('H1')) {
    switch (move) {
      case 'L': newIndex = currentIndex - 2; break;
      case 'R': newIndex = currentIndex + 2; break;
      case 'F': newIndex = gameState.currentPlayer === 'A' ? currentIndex + 10 : currentIndex - 10; break;
      case 'B': newIndex = gameState.currentPlayer === 'A' ? currentIndex - 10 : currentIndex + 10; break;
    }
  } else if (character.includes('H2')) {
    switch (move) {
      case 'FL': newIndex = gameState.currentPlayer === 'A' ? currentIndex + 8 : currentIndex - 12; break;
      case 'FR': newIndex = gameState.currentPlayer === 'A' ? currentIndex + 12 : currentIndex - 8; break;
      case 'BL': newIndex = gameState.currentPlayer === 'A' ? currentIndex - 12 : currentIndex + 8; break;
      case 'BR': newIndex = gameState.currentPlayer === 'A' ? currentIndex - 8 : currentIndex + 12; break;
    }
  }

  gameState.board[currentIndex] = null;
  gameState.board[newIndex] = character;
  gameState.moveHistory.push(`${character}:${move}`);
  gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';
  return true;
}

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('gameState', gameState);

  socket.on('makeMove', (moveCommand) => {
    const [character, move] = moveCommand.split(':');
    if (makeMove(character, move)) {
      io.emit('gameState', gameState);
    }
  });

  socket.on('startGame', () => {
    initializeGame();
    io.emit('gameState', gameState);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  initializeGame();
});
