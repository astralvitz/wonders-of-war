'use client';

import { useGame } from '../lib/gameContext';

export default function GameCountdown() {
  const { countdown, opponent } = useGame();
  
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold text-white mb-2">
        Opponent Found!
      </h2>
      
      {opponent && (
        <p className="text-gray-300 mb-6">
          Playing against: {opponent.twitterHandle ? `@${opponent.twitterHandle}` : 'Unknown Player'}
        </p>
      )}
      
      <div className="mb-6">
        <div className="text-5xl font-bold text-blue-500 mb-2">
          {countdown}
        </div>
        <p className="text-gray-400">
          Game starting in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>
      </div>
      
      <div className="text-gray-300">
        <p>Get ready to choose:</p>
        <div className="flex justify-center space-x-4 mt-2">
          <div className="text-3xl">✊</div>
          <div className="text-3xl">✋</div>
          <div className="text-3xl">✌️</div>
        </div>
      </div>
    </div>
  );
} 