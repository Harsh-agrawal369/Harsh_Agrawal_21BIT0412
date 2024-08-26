const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const e = require("cors");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

// Initial game state
const gameState = {
  board: Array(25).fill(null),
  currentPlayer: "A",
  moveHistory: [],
  error: null,
};

const error = (message) => {
  gameState.error = message;
  io.emit("gameState", gameState);
  gameState.error = null;
};

function initializeGame() {
  gameState.board = [

    "A-P1", "A-P2", "A-H1", "A-H2", "A-P3",
    null, null, null, null, null,
    null, null, null, null, null,
    null, null, null, null, null,
    "B-P1", "B-P2", "B-H1", "B-H2", "B-P3",
  ];
  gameState.currentPlayer = "A";
  gameState.moveHistory = [];
}

function isValidMove(character, move, currentIndex) {
  const row = Math.floor(currentIndex / 5);
  const col = currentIndex % 5;

  console.log("row", row);
  console.log("col", col);
  console.log("currentIndex", currentIndex);
  console.log("move", move);
  console.log("character", character);
  console.log("gameState.currentPlayer", gameState.currentPlayer);
  console.log(character.includes("P"));
  console.log(character.includes("H1"));
  console.log(character.includes("H2"));

  if (character.includes("P")) {
    if (move === "L") {
      if (col === 0) {
        error("You cannot move off the board");
        return false;
      }

      if (
        gameState.board[currentIndex - 1] &&
        gameState.board[currentIndex - 1].startsWith(gameState.currentPlayer)
      ) {
        error("You cannot move through your own piece");
        return false;
      }

      // if (
      //   gameState.board[currentIndex - 1] &&
      //   gameState.board[currentIndex - 1].startsWith(
      //     gameState.currentPlayer === "A" ? "B" : "A"
      //   )
      // ) {
      //   error("Pawn cannot Kill! Invalid Move");
      //   return false;
      // }
    } else if (move === "R") {
      if (col === 4) {
        error("You cannot move off the board");
        return false;
      }

      if (
        gameState.board[currentIndex + 1] &&
        gameState.board[currentIndex + 1].startsWith(gameState.currentPlayer)
      ) {
        error("You cannot move through your own piece");
        return false;
      }

      // if (
      //   gameState.board[currentIndex + 1] &&
      //   gameState.board[currentIndex + 1].startsWith(
      //     gameState.currentPlayer === "A" ? "B" : "A"
      //   )
      // ) {
      //   error("Pawn cannot Kill! Invalid Move");
      //   return false;
      // }
    } else if (move === "F") {
      if (gameState.currentPlayer === "A") {
        if (row === 4) {
          error("You cannot move off the board");
          return false;
        }

        if (
          gameState.board[currentIndex + 5] &&
          gameState.board[currentIndex + 5].startsWith(gameState.currentPlayer)
        ) {
          error("You cannot move through your own piece");
          return false;
        }

        // if (
        //   gameState.board[currentIndex + 5] &&
        //   gameState.board[currentIndex + 5].startsWith(
        //     gameState.currentPlayer === "A" ? "B" : "A"
        //   )
        // ) {
        //   error("Pawn cannot Kill! Invalid Move");
        //   return false;
        // }
      } else {
        if (row === 0) {
          error("You cannot move off the board");
          return false;
        }

        if (
          gameState.board[currentIndex - 5] &&
          gameState.board[currentIndex - 5].startsWith(gameState.currentPlayer)
        ) {
          error("You cannot move through your own piece");
          return false;
        }

        // if (
        //   gameState.board[currentIndex - 5] &&
        //   gameState.board[currentIndex - 5].startsWith(
        //     gameState.currentPlayer === "A" ? "B" : "A"
        //   )
        // ) {
        //   error("Pawn cannot Kill! Invalid Move");
        //   return false;
        // }
      }
    } else if (move === "B") {
      if (gameState.currentPlayer === "A") {
        if (row === 0) {
          error("You cannot move off the board");
          return false;
        }

        if (
          gameState.board[currentIndex - 5] &&
          gameState.board[currentIndex - 5].startsWith(gameState.currentPlayer)
        ) {
          error("You cannot move through your own piece");
          return false;
        }

        // if (
        //   gameState.board[currentIndex - 5] &&
        //   gameState.board[currentIndex - 5].startsWith(
        //     gameState.currentPlayer === "A" ? "B" : "A"
        //   )
        // ) {
        //   error("Pawn cannot Kill! Invalid Move");
        //   return false;
        // }
      } else {
        if (row === 4) {
          error("You cannot move off the board");
          return false;
        }

        if (
          gameState.board[currentIndex + 5] &&
          gameState.board[currentIndex + 5].startsWith(gameState.currentPlayer)
        ) {
          error("You cannot move through your own piece");
          return false;
        }

        // if (
        //   gameState.board[currentIndex + 5] &&
        //   gameState.board[currentIndex + 5].startsWith(
        //     gameState.currentPlayer === "A" ? "B" : "A"
        //   )
        // ) {
        //   error("Pawn cannot Kill! Invalid Move");
        //   return false;
        // }
      }
    }
  } else if (character.includes("H1")) {
    if (move === "L") {
      if (col <= 1) {
        error("You cannot move off the board");
        return false;
      }

      if (
        gameState.board[currentIndex - 1] &&
        gameState.board[currentIndex - 1].startsWith(gameState.currentPlayer)
      ) {
        error("You cannot move through your own piece");
        return false;
      } else {
        gameState.board[currentIndex - 1] = null;
      }
    } else if (move === "R") {
      if (col >= 3) {
        error("You cannot move off the board");
        return false;
      }

      if (
        gameState.board[currentIndex + 1] &&
        gameState.board[currentIndex + 1].startsWith(gameState.currentPlayer)
      ) {
        error("You cannot move through your own piece");
        return false;
      } else {
        gameState.board[currentIndex + 1] = null;
      }
    } else if (move === "F") {
      if (gameState.currentPlayer === "A") {
        if (row >= 3) {
          error("You cannot move off the board");
          return false;
        }

        if (
          gameState.board[currentIndex + 10] &&
          gameState.board[currentIndex + 10].startsWith(gameState.currentPlayer)
        ) {
          error("You cannot move through your own piece");
          return false;
        } else {
          gameState.board[currentIndex + 10] = null;
        }
      } else {
        if (row <= 1) {
          error("You cannot move off the board");
          return false;
        }

        if (
          gameState.board[currentIndex - 10] &&
          gameState.board[currentIndex - 10].startsWith(gameState.currentPlayer)
        ) {
          error("You cannot move through your own piece");
          return false;
        } else {
          gameState.board[currentIndex - 10] = null;
        }
      }
    } else if (move === "B") {
      if (gameState.currentPlayer === "A") {
        if (row <= 1) {
          error("You cannot move off the board");
          return false;
        }

        if (
          gameState.board[currentIndex - 10] &&
          gameState.board[currentIndex - 10].startsWith(gameState.currentPlayer)
        ) {
          error("You cannot move through your own piece");
          return false;
        } else {
          gameState.board[currentIndex - 10] = null;
        }
      } else {
        if (row >= 3) {
          error("You cannot move off the board");
          return false;
        }

        if (
          gameState.board[currentIndex + 10] &&
          gameState.board[currentIndex + 10].startsWith(gameState.currentPlayer)
        ) {
          error("You cannot move through your own piece");
          return false;
        } else {
          gameState.board[currentIndex + 10] = null;
        }
      }
    }
  } else if (character.includes("H2")) {
    if (move === "FL") {
      if (row <= 1 || col <= 1) {
        error("You cannot move off the board");
        return false;
      }

      if (
        gameState.board[currentIndex - 4] &&
        gameState.board[currentIndex - 4].startsWith(
          gameState.currentPlayer === "A" ? "B" : "A"
        )
      ) {
        error("You cannot move through your own piece");
        return false;
      } else {
        gameState.board[currentIndex - 4] = null;
      }
    } else if (move === "FR") {
      if (row <= 1 || col >= 3) {
        error("You cannot move off the board");
        return false;
      }

      if (
        gameState.board[currentIndex - 12] &&
        gameState.board[currentIndex - 12].startsWith(gameState.currentPlayer)
      ) {
        error("You cannot move through your own piece");
        return false;
      } else {
        gameState.board[currentIndex - 12] = null;
      }
    } else if (move === "BL") {
      if (row >= 3 || col <= 1) {
        error("You cannot move off the board");
        return false;
      }

      if (
        gameState.board[currentIndex + 12] &&
        gameState.board[currentIndex + 12].startsWith(gameState.currentPlayer)
      ) {
        error("You cannot move through your own piece");
        return false;
      } else {
        gameState.board[currentIndex + 12] = null;
      }
    } else if (move === "BR") {
      if (row >= 3 || col >= 3) {
        error("You cannot move off the board");
        return false;
      }

      if (
        gameState.board[currentIndex + 8] &&
        gameState.board[currentIndex + 8].startsWith(gameState.currentPlayer)
      ) {
        error("You cannot move through your own piece");
        return false;
      } else {
        gameState.board[currentIndex + 8] = null;
      }
    }
  }

  return true;
}

function makeMove(character, move) {
  gameState.error = null;

  if (gameState.currentPlayer !== character[0]) {
    error("Not your turn");
    return false;
  }

  const currentIndex = gameState.board.indexOf(character);
  if (currentIndex === -1 || !isValidMove(character, move, currentIndex)) {
    return false;
  }

  let newIndex;
  const row = Math.floor(currentIndex / 5);
  const col = currentIndex % 5;

  if (character.includes("P")) {
    if (move === "L") {
      newIndex = currentIndex - 1;
    } else if (move === "R") {
      newIndex = currentIndex + 1;
    } else if (move === "F") {
      newIndex =
        gameState.currentPlayer === "A" ? currentIndex + 5 : currentIndex - 5;
    } else if (move === "B") {
      newIndex =
        gameState.currentPlayer === "A" ? currentIndex - 5 : currentIndex + 5;
    }
  } else if (character.includes("H1")) {
    if (move === "L") {
      newIndex = currentIndex - 2;
    } else if (move === "R") {
      newIndex = currentIndex + 2;
    } else if (move === "F") {
      newIndex =
        gameState.currentPlayer === "A" ? currentIndex + 10 : currentIndex - 10;
    } else if (move === "B") {
      newIndex =
        gameState.currentPlayer === "A" ? currentIndex - 10 : currentIndex + 10;
    }
  } else if (character.includes("H2")) {
    if (move === "FL") {
      newIndex =
        gameState.currentPlayer === "A" ? currentIndex + 8 : currentIndex - 12;
    } else if (move === "FR") {
      newIndex =
        gameState.currentPlayer === "A" ? currentIndex + 12 : currentIndex - 8;
    } else if (move === "BL") {
      newIndex =
        gameState.currentPlayer === "A" ? currentIndex - 12 : currentIndex + 8;
    } else if (move === "BR") {
      newIndex =
        gameState.currentPlayer === "A" ? currentIndex - 8 : currentIndex + 12;
    }
  }

  gameState.board[currentIndex] = null;
  gameState.board[newIndex] = character;
  gameState.moveHistory.push(`${character}:${move}`);
  gameState.currentPlayer = gameState.currentPlayer === "A" ? "B" : "A";
  return true;
}

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("gameState", gameState);

  socket.on("makeMove", (moveCommand) => {
    const [character, move] = moveCommand.split(":");
    if (makeMove(character, move)) {
      io.emit("gameState", gameState);
    }
  });

  socket.on("startGame", () => {
    initializeGame();
    io.emit("gameState", gameState);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    initializeGame();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  initializeGame();
});
