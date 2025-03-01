import { Server as NetServer } from 'http';
import { NextRequest } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

// Game types
type GameChoice = 'rock' | 'paper' | 'scissors' | null;
type GameResult = 'win' | 'loss' | 'draw' | null;

interface GamePlayer {
  id: string;
  twitterHandle?: string;
  socketId: string;
  choice: GameChoice;
}

interface Game {
  id: string;
  players: GamePlayer[];
  rounds: {
    player1Choice: GameChoice;
    player2Choice: GameChoice;
    result: GameResult;
  }[];
  currentRound: number;
  lobbyCode?: string;
  status: 'waiting' | 'playing' | 'finished';
}

// In-memory storage for active games
const games: Game[] = [];
const waitingPlayers: { id: string; socketId: string; twitterHandle?: string }[] = [];
const playerSocketMap = new Map<string, string>(); // userId -> socketId
const socketPlayerMap = new Map<string, string>(); // socketId -> userId

// Generate a random 6-character lobby code
function generateLobbyCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Determine the winner of a round
function determineWinner(player1Choice: GameChoice, player2Choice: GameChoice): GameResult {
  if (!player1Choice || !player2Choice) return null;
  
  if (player1Choice === player2Choice) return 'draw';
  
  if (
    (player1Choice === 'rock' && player2Choice === 'scissors') ||
    (player1Choice === 'paper' && player2Choice === 'rock') ||
    (player1Choice === 'scissors' && player2Choice === 'paper')
  ) {
    return 'win';
  }
  
  return 'loss';
}

// Global variable to track if socket server is initialized
let io: SocketIOServer;

function initSocketServer(res: any) {
  if (!io) {
    const httpServer: NetServer = res.socket.server;
    
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      // Identify user
      socket.on('identify', async ({ userId }) => {
        try {
          // Get user from database
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, twitterHandle: true }
          });
          
          if (!user) {
            socket.emit('error', 'User not found');
            return;
          }
          
          // Map socket to user
          playerSocketMap.set(userId, socket.id);
          socketPlayerMap.set(socket.id, userId);
          
          console.log(`User ${userId} identified with socket ${socket.id}`);
        } catch (error) {
          console.error('Error identifying user:', error);
          socket.emit('error', 'Failed to identify user');
        }
      });
      
      // Join random game
      socket.on('join_random_game', async ({ userId }) => {
        try {
          // Get user from database
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, twitterHandle: true }
          });
          
          if (!user) {
            socket.emit('error', 'User not found');
            return;
          }
          
          // Check if there's a waiting player
          if (waitingPlayers.length > 0) {
            const opponent = waitingPlayers.shift()!;
            
            // Create a new game
            const gameId = `game_${Date.now()}`;
            const newGame: Game = {
              id: gameId,
              players: [
                { 
                  id: opponent.id, 
                  socketId: opponent.socketId,
                  twitterHandle: opponent.twitterHandle,
                  choice: null 
                },
                { 
                  id: user.id, 
                  socketId: socket.id,
                  twitterHandle: user.twitterHandle || undefined,
                  choice: null 
                }
              ],
              rounds: [],
              currentRound: 0,
              status: 'playing'
            };
            
            games.push(newGame);
            
            // Notify both players
            io.to(opponent.socketId).emit('opponent_joined', {
              opponent: {
                id: user.id,
                twitterHandle: user.twitterHandle || undefined
              }
            });
            
            socket.emit('opponent_joined', {
              opponent: {
                id: opponent.id,
                twitterHandle: opponent.twitterHandle
              }
            });
            
            // Start countdown
            let countdown = 10;
            const countdownInterval = setInterval(() => {
              io.to(opponent.socketId).emit('countdown', { countdown });
              socket.emit('countdown', { countdown });
              
              countdown--;
              
              if (countdown < 0) {
                clearInterval(countdownInterval);
              }
            }, 1000);
          } else {
            // Add player to waiting list
            waitingPlayers.push({
              id: user.id,
              socketId: socket.id,
              twitterHandle: user.twitterHandle || undefined
            });
            
            socket.emit('waiting_for_opponent');
          }
        } catch (error) {
          console.error('Error joining random game:', error);
          socket.emit('error', 'Failed to join random game');
        }
      });
      
      // Create custom game
      socket.on('create_custom_game', async ({ userId }) => {
        try {
          // Get user from database
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, twitterHandle: true }
          });
          
          if (!user) {
            socket.emit('error', 'User not found');
            return;
          }
          
          // Generate a unique lobby code
          let lobbyCode = generateLobbyCode();
          while (games.some(game => game.lobbyCode === lobbyCode)) {
            lobbyCode = generateLobbyCode();
          }
          
          // Create a new game
          const gameId = `game_${Date.now()}`;
          const newGame: Game = {
            id: gameId,
            players: [
              { 
                id: user.id, 
                socketId: socket.id,
                twitterHandle: user.twitterHandle || undefined,
                choice: null 
              }
            ],
            rounds: [],
            currentRound: 0,
            lobbyCode,
            status: 'waiting'
          };
          
          games.push(newGame);
          
          // Notify the player
          socket.emit('game_created', { lobbyCode });
        } catch (error) {
          console.error('Error creating custom game:', error);
          socket.emit('error', 'Failed to create custom game');
        }
      });
      
      // Join custom game
      socket.on('join_custom_game', async ({ userId, lobbyCode }) => {
        try {
          // Get user from database
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, twitterHandle: true }
          });
          
          if (!user) {
            socket.emit('error', 'User not found');
            return;
          }
          
          // Find the game with the given lobby code
          const gameIndex = games.findIndex(game => game.lobbyCode === lobbyCode && game.status === 'waiting');
          
          if (gameIndex === -1) {
            socket.emit('error', 'Game not found or already started');
            return;
          }
          
          const game = games[gameIndex];
          
          // Check if the player is already in the game
          if (game.players.some(player => player.id === user.id)) {
            socket.emit('error', 'You are already in this game');
            return;
          }
          
          // Add the player to the game
          game.players.push({
            id: user.id,
            socketId: socket.id,
            twitterHandle: user.twitterHandle || undefined,
            choice: null
          });
          
          // Update game status
          game.status = 'playing';
          
          // Notify both players
          const opponent = game.players[0];
          io.to(opponent.socketId).emit('opponent_joined', {
            opponent: {
              id: user.id,
              twitterHandle: user.twitterHandle || undefined
            }
          });
          
          socket.emit('opponent_joined', {
            opponent: {
              id: opponent.id,
              twitterHandle: opponent.twitterHandle
            }
          });
          
          // Start countdown
          let countdown = 10;
          const countdownInterval = setInterval(() => {
            io.to(opponent.socketId).emit('countdown', { countdown });
            socket.emit('countdown', { countdown });
            
            countdown--;
            
            if (countdown < 0) {
              clearInterval(countdownInterval);
            }
          }, 1000);
        } catch (error) {
          console.error('Error joining custom game:', error);
          socket.emit('error', 'Failed to join custom game');
        }
      });
      
      // Make a choice
      socket.on('make_choice', async ({ userId, choice }) => {
        try {
          // Find the game the player is in
          const gameIndex = games.findIndex(game => 
            game.players.some(player => player.id === userId) && 
            game.status === 'playing'
          );
          
          if (gameIndex === -1) {
            socket.emit('error', 'Game not found or not in playing state');
            return;
          }
          
          const game = games[gameIndex];
          
          // Find the player
          const playerIndex = game.players.findIndex(player => player.id === userId);
          
          if (playerIndex === -1) {
            socket.emit('error', 'Player not found in game');
            return;
          }
          
          // Update the player's choice
          game.players[playerIndex].choice = choice;
          
          // Check if both players have made a choice
          const player1 = game.players[0];
          const player2 = game.players[1];
          
          if (player1.choice && player2.choice) {
            // Determine the winner
            const result = determineWinner(player1.choice, player2.choice);
            
            // Store the choices before resetting
            const player1Choice = player1.choice;
            const player2Choice = player2.choice;
            
            // Add the round to the game
            game.rounds.push({
              player1Choice: player1Choice,
              player2Choice: player2Choice,
              result
            });
            
            // Reset choices for next round
            player1.choice = null;
            player2.choice = null;
            
            // Increment current round
            game.currentRound++;
            
            // Send round results to players
            io.to(player1.socketId).emit('round_result', {
              playerChoice: player1Choice,
              opponentChoice: player2Choice,
              result,
              currentRound: game.currentRound
            });
            
            io.to(player2.socketId).emit('round_result', {
              playerChoice: player2Choice,
              opponentChoice: player1Choice,
              result: result === 'win' ? 'loss' : result === 'loss' ? 'win' : result,
              currentRound: game.currentRound
            });
            
            // Check if the game is finished (best of 3)
            const player1Wins = game.rounds.filter(round => round.result === 'win').length;
            const player2Wins = game.rounds.filter(round => round.result === 'loss').length;
            
            if (player1Wins >= 2 || player2Wins >= 2) {
              // Game is finished
              game.status = 'finished';
              
              // Determine the winner
              const winner = player1Wins >= 2 ? player1.id : player2.id;
              const loser = player1Wins >= 2 ? player2.id : player1.id;
              
              // Update the database
              try {
                // Update winner's stats
                await prisma.user.update({
                  where: { id: winner },
                  data: {
                    eloRating: { increment: 10 },
                    totalWins: { increment: 1 }
                  }
                });
                
                // Update loser's stats
                await prisma.user.update({
                  where: { id: loser },
                  data: {
                    eloRating: { decrement: 5 },
                    totalLosses: { increment: 1 }
                  }
                });
                
                // Notify players
                io.to(player1.socketId).emit('game_finished', {
                  winner: player1Wins >= 2 ? player1.id : player2.id
                });
                
                io.to(player2.socketId).emit('game_finished', {
                  winner: player1Wins >= 2 ? player1.id : player2.id
                });
              } catch (error) {
                console.error('Error updating user stats:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error making choice:', error);
          socket.emit('error', 'Failed to make choice');
        }
      });
      
      // Leave game
      socket.on('leave_game', () => {
        const socketId = socket.id;
        const userId = socketPlayerMap.get(socketId);
        
        if (!userId) return;
        
        // Remove from waiting players
        const waitingIndex = waitingPlayers.findIndex(player => player.socketId === socketId);
        if (waitingIndex !== -1) {
          waitingPlayers.splice(waitingIndex, 1);
        }
        
        // Find the game the player is in
        const gameIndex = games.findIndex(game => 
          game.players.some(player => player.socketId === socketId)
        );
        
        if (gameIndex !== -1) {
          const game = games[gameIndex];
          
          // Notify the other player
          const otherPlayer = game.players.find(player => player.socketId !== socketId);
          if (otherPlayer) {
            io.to(otherPlayer.socketId).emit('opponent_left');
          }
          
          // Remove the game
          games.splice(gameIndex, 1);
        }
      });
      
      // Disconnect
      socket.on('disconnect', () => {
        const socketId = socket.id;
        const userId = socketPlayerMap.get(socketId);
        
        console.log('Client disconnected:', socketId);
        
        if (userId) {
          // Remove from maps
          socketPlayerMap.delete(socketId);
          playerSocketMap.delete(userId);
          
          // Remove from waiting players
          const waitingIndex = waitingPlayers.findIndex(player => player.socketId === socketId);
          if (waitingIndex !== -1) {
            waitingPlayers.splice(waitingIndex, 1);
          }
          
          // Find the game the player is in
          const gameIndex = games.findIndex(game => 
            game.players.some(player => player.socketId === socketId)
          );
          
          if (gameIndex !== -1) {
            const game = games[gameIndex];
            
            // Notify the other player
            const otherPlayer = game.players.find(player => player.socketId !== socketId);
            if (otherPlayer) {
              io.to(otherPlayer.socketId).emit('opponent_left');
            }
            
            // Remove the game
            games.splice(gameIndex, 1);
          }
        }
      });
    });
    
    console.log('Socket.io server initialized');
  }
  
  return io;
}

export async function GET(req: NextRequest, res: any) {
  initSocketServer(res);
  return new Response('Socket.io server running');
}

export async function POST(req: NextRequest, res: any) {
  initSocketServer(res);
  return new Response('Socket.io server running');
} 