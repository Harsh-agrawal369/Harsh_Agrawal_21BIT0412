import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3000');

function App() {
  const [gameState, setGameState] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('gameState', (newGameState) => {
      console.log('Received new game state:', newGameState);
      setGameState(newGameState);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('gameState');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const handleCellClick = (index) => {
    if (gameState && gameState.board[index]) {
      setSelectedCell(index);
    }
  };

  const handleMove = (move) => {
    if (selectedCell !== null && gameState.board[selectedCell]) {
      const character = gameState.board[selectedCell];
      const moveCommand = `${character}:${move}`;
      console.log('Sending move command:', moveCommand);
      socket.emit('makeMove', moveCommand);
      setSelectedCell(null);
    }
  };

  const getMoveOptions = (character) => {
    if (!character) return [];
    if (character.includes('P')) return ['L', 'R', 'F', 'B'];
    if (character.includes('H1')) return ['L', 'R', 'F', 'B'];
    if (character.includes('H2')) return ['FL', 'FR', 'BL', 'BR'];
    return [];
  };

  const renderBoard = () => {
    const initialBoard = [
      'A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3',
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      'B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3',
    ];

    const board = gameState ? gameState.board : initialBoard;
    return board.map((cell, index) => (
      <div
        key={index}
        className={`cell ${selectedCell === index ? 'selected' : ''} ${cell ? 'occupied' : ''}`}
        onClick={() => handleCellClick(index)}
      >
        {cell}
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>Chess-like Game</h1>
      {gameState ? (
        <>
          <div className="current-player">Current Player: {gameState.currentPlayer}</div>
          <div className="game-board">
            {renderBoard()}
          </div>
          <div className="move-options">
            {selectedCell !== null &&
              getMoveOptions(gameState.board[selectedCell]).map((move) => (
                <button key={move} onClick={() => handleMove(move)}>
                  {move}
                </button>
              ))}
          </div>
          <div className="move-history">
            <h3>Move History</h3>
            <div className="history-list">
              {gameState.moveHistory.map((move, index) => (
                <div key={index}>{move}</div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>Waiting for game to load, Server might take some time to restart\...</p>
      )}
    </div>
  );
}

export default App;
