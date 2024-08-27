# Chess Game - A new Approach

This is a turn-based, chess-like game implemented with a Node.js backend using Express and Socket.IO, and a React frontend.

## Installation

### Backend

Move to the backend folder cd ./backend

1. Clone the repository: https://github.com/Harsh-agrawal369/Harsh_Agrawal_21BIT0412
2. Install backend dependencies: express cors path http socket.io nodemon

### Frontend

Move to frontend folder cd ./frontend

3. Install frontend dependencies: react react-dom socket.io-client

## Running the Application

### Backend

1. Start the backend server: 
cd backend
npm run dev

### Frontend

2. In a new terminal, start the frontend development server:
cd client
npm run dev
frontend will be available at http://localhost:5173

## Game Rules

- The game is played on a 5x5 grid.
- Each player starts with 5 characters: 3 Pawns, 1 Hero1, and 1 Hero2.
- Players take turns moving their characters.
- Pawns can move one space in any direction.
- Hero1 can move two spaces horizontally or vertically and can kill any opponent in its path.
- Hero2 can move two spaces diagonally and can kill any opponent in its path.
- The game ends when all characters of one player are eliminated