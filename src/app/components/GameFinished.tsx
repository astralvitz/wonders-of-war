'use client';

import { useGame } from '../lib/gameContext';
import Link from 'next/link';
import GameResult from './GameResult';

export default function GameFinished() {
  const { rounds, opponent, resetGame } = useGame();
  
  // Calculate final score
  const playerScore = rounds.filter(round => round.result === 'win').length;
  const opponentScore = rounds.filter(round => round.result === 'loss').length;
  
  const playerWon = playerScore > opponentScore;
  
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Game Finished
        </h2>
        <div className={`text-2xl font-bold ${playerWon ? 'text-green-400' : 'text-red-400'} mb-4`}>
          {playerWon ? 'You Won!' : 'You Lost!'}
        </div>
        
        <div className="flex justify-center items-center space-x-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-400">You</div>
            <div className="text-3xl font-bold text-white">{playerScore}</div>
          </div>
          
          <div className="text-xl text-gray-500">vs</div>
          
          <div className="text-center">
            <div className="text-sm text-gray-400">
              {opponent?.twitterHandle ? `@${opponent.twitterHandle}` : 'Opponent'}
            </div>
            <div className="text-3xl font-bold text-white">{opponentScore}</div>
          </div>
        </div>
      </div>
      
      {/* Round results */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Match History</h3>
        {rounds.map((round, index) => (
          <GameResult key={index} round={round} roundNumber={index + 1} />
        ))}
      </div>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={resetGame}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Play Again
        </button>
        
        <Link
          href="/leaderboard"
          className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors text-center"
        >
          View Leaderboard
        </Link>
        
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