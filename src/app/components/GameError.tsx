'use client';

import { useGame } from '../lib/gameContext';
import Link from 'next/link';

export default function GameError() {
  const { error, resetGame } = useGame();
  
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="text-red-500 text-5xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          Game Error
        </h2>
        
        <p className="text-gray-300 mb-6">
          {error || "An unexpected error occurred during the game."}
        </p>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={resetGame}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Try Again
        </button>
        
        <Link
          href="/"
          className="text-gray-400 hover:text-gray-300 text-sm text-center"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 