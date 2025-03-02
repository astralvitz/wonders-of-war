'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { usePathname } from 'next/navigation';

// Game types
export type GameChoice = 'rock' | 'paper' | 'scissors' | null;
export type GameResult = 'win' | 'loss' | 'draw' | null;

export interface GameRound {
  playerChoice: GameChoice;
  opponentChoice: GameChoice;
  result: GameResult;
}

export type GameMode = 'random' | 'custom' | null;
export type GameStatus = 'waiting' | 'connecting' | 'countdown' | 'playing' | 'finished' | 'error';

interface GameContextType {
  // Game state
  gameMode: GameMode;
  gameStatus: GameStatus;
  lobbyCode: string | null;
  opponent: { id: string; twitterHandle?: string } | null;
  rounds: GameRound[];
  currentRound: number;
  countdown: number;
  error: string | null;
  
  // Game actions
  startRandomGame: () => void;
  createCustomGame: () => void;
  joinCustomGame: (code: string) => void;
  makeChoice: (choice: GameChoice) => void;
  resetGame: () => void;
  leaveGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const pathname = usePathname();
  
  // Game state
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');
  const [lobbyCode, setLobbyCode] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<{ id: string; twitterHandle?: string } | null>(null);
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  
  // Check if we're on a game-related page
  const isGamePage = pathname?.startsWith('/game');
  
  // Initialize socket connection only when needed
  const connectSocket = () => {
    // Only connect if we're on a game-related page
    if (!session || socket || !isGamePage) return;
    
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!socketUrl) {
      console.warn('NEXT_PUBLIC_SOCKET_URL is not set. Socket connection will not be established.');
      return;
    }
    
    console.log('Connecting to socket server at:', socketUrl);
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    
    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      // Identify the user to the server
      newSocket.emit('identify', { userId: session.user.id });
    });
    
    newSocket.on('error', (message: string) => {
      setError(message);
      setGameStatus('error');
    });
    
    newSocket.on('game_created', (data: { lobbyCode: string }) => {
      setLobbyCode(data.lobbyCode);
      setGameStatus('waiting');
    });
    
    newSocket.on('opponent_joined', (data: { opponent: { id: string; twitterHandle?: string } }) => {
      setOpponent(data.opponent);
      setGameStatus('countdown');
      setCountdown(10);
    });
    
    newSocket.on('countdown', (data: { countdown: number }) => {
      setCountdown(data.countdown);
      if (data.countdown === 0) {
        setGameStatus('playing');
      }
    });
    
    newSocket.on('round_result', (data: { 
      playerChoice: GameChoice; 
      opponentChoice: GameChoice; 
      result: GameResult;
      currentRound: number;
    }) => {
      const newRound: GameRound = {
        playerChoice: data.playerChoice,
        opponentChoice: data.opponentChoice,
        result: data.result
      };
      
      setRounds(prev => [...prev, newRound]);
      setCurrentRound(data.currentRound);
      
      // Check if game is finished (best of 3)
      const playerWins = [...rounds, newRound].filter(r => r.result === 'win').length;
      const opponentWins = [...rounds, newRound].filter(r => r.result === 'loss').length;
      
      if (playerWins >= 2 || opponentWins >= 2) {
        setGameStatus('finished');
      }
    });
    
    newSocket.on('game_finished', (data: { winner: string }) => {
      setGameStatus('finished');
    });
    
    newSocket.on('opponent_left', () => {
      setError('Your opponent has left the game');
      setGameStatus('error');
    });
  };
  
  // Disconnect socket when navigating away from game pages
  useEffect(() => {
    if (!isGamePage && socket) {
      console.log('Disconnecting socket - not on game page');
      socket.disconnect();
      setSocket(null);
    }
  }, [isGamePage, socket]);
  
  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);
  
  // Game actions
  const startRandomGame = () => {
    if (!session) return;
    
    // Connect to socket if not already connected
    if (!socket) {
      connectSocket();
      // We'll need to wait for the socket to connect before proceeding
      setGameMode('random');
      setGameStatus('connecting');
      setRounds([]);
      setCurrentRound(0);
      setError(null);
      return;
    }
    
    setGameMode('random');
    setGameStatus('connecting');
    setRounds([]);
    setCurrentRound(0);
    setError(null);
    
    socket.emit('join_random_game', { userId: session.user.id });
  };
  
  const createCustomGame = () => {
    if (!session) return;
    
    // Connect to socket if not already connected
    if (!socket) {
      connectSocket();
      // We'll need to wait for the socket to connect before proceeding
      setGameMode('custom');
      setGameStatus('waiting');
      setRounds([]);
      setCurrentRound(0);
      setError(null);
      return;
    }
    
    setGameMode('custom');
    setGameStatus('waiting');
    setRounds([]);
    setCurrentRound(0);
    setError(null);
    
    socket.emit('create_custom_game', { userId: session.user.id });
  };
  
  const joinCustomGame = (code: string) => {
    if (!session) return;
    
    // Connect to socket if not already connected
    if (!socket) {
      connectSocket();
      // We'll need to wait for the socket to connect before proceeding
      setGameMode('custom');
      setGameStatus('connecting');
      setLobbyCode(code);
      setRounds([]);
      setCurrentRound(0);
      setError(null);
      return;
    }
    
    setGameMode('custom');
    setGameStatus('connecting');
    setLobbyCode(code);
    setRounds([]);
    setCurrentRound(0);
    setError(null);
    
    socket.emit('join_custom_game', { userId: session.user.id, lobbyCode: code });
  };
  
  const makeChoice = (choice: GameChoice) => {
    if (!session || gameStatus !== 'playing') return;
    
    // Connect to socket if not already connected
    if (!socket) {
      setError('Not connected to game server');
      return;
    }
    
    socket.emit('make_choice', { userId: session.user.id, choice });
  };
  
  const resetGame = () => {
    setGameMode(null);
    setGameStatus('waiting');
    setLobbyCode(null);
    setOpponent(null);
    setRounds([]);
    setCurrentRound(0);
    setCountdown(10);
    setError(null);
    
    // Disconnect socket when game is reset
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };
  
  const leaveGame = () => {
    if (socket) {
      socket.emit('leave_game');
    }
    resetGame();
  };
  
  const value = {
    gameMode,
    gameStatus,
    lobbyCode,
    opponent,
    rounds,
    currentRound,
    countdown,
    error,
    startRandomGame,
    createCustomGame,
    joinCustomGame,
    makeChoice,
    resetGame,
    leaveGame
  };
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}; 