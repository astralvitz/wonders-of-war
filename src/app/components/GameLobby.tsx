'use client';

import { useState } from 'react';
import { useGame } from '../lib/gameContext';
import Link from 'next/link';

export default function GameLobby() {
  const { 
    gameMode, 
    gameStatus, 
    lobbyCode, 
    startRandomGame, 
    createCustomGame, 
    joinCustomGame 
  } = useGame();
  
  const [customCode, setCustomCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  
  const handleJoinCustom = () => {
    if (customCode.trim()) {
      joinCustomGame(customCode.trim());
    }
  };
  
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Play Wonders of War
      </h2>
      
      {gameStatus === 'waiting' && gameMode === 'custom' && lobbyCode ? (
        <div className="text-center mb-6">
          <p className="text-gray-300 mb-2">Share this code with your opponent:</p>
          <div className="bg-gray-700 rounded-md p-3 mb-4">
            <span className="text-xl font-mono text-white tracking-wider">{lobbyCode}</span>
          </div>
          <p className="text-gray-400 text-sm">Waiting for opponent to join...</p>
        </div>
      ) : gameStatus === 'connecting' ? (
        <div className="text-center mb-6">
          <p className="text-gray-300 mb-4">Connecting to game...</p>
          <div className="animate-pulse flex justify-center">
            <div className="h-2 w-24 bg-blue-500 rounded"></div>
          </div>
        </div>
      ) : gameStatus === 'waiting' && (
        <>
          <div className="space-y-4 mb-6">
            <button
              onClick={startRandomGame}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Find Random Opponent
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>
            
            {showCodeInput ? (
              <div className="space-y-2">
                <div className="flex">
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="Enter game code"
                    className="flex-1 py-2 px-3 bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleJoinCustom}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-md transition-colors"
                  >
                    Join
                  </button>
                </div>
                <button
                  onClick={() => setShowCodeInput(false)}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={createCustomGame}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                >
                  Create Private Game
                </button>
                <button
                  onClick={() => setShowCodeInput(true)}
                  className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
                >
                  Join with Code
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="text-center">
        <Link
          href="/"
          className="text-gray-400 hover:text-gray-300 text-sm"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 