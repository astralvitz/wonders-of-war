'use client';

import { useState } from 'react';
import { useGame, GameChoice } from '../lib/gameContext';
import GameChoiceComponent from './GameChoice';
import GameResult from './GameResult';

export default function GamePlay() {
  const { rounds, currentRound, opponent, makeChoice } = useGame();
  const [selectedChoice, setSelectedChoice] = useState<GameChoice>(null);
  const [hasSelected, setHasSelected] = useState(false);
  
  const handleSelect = (choice: GameChoice) => {
    if (hasSelected) return;
    
    setSelectedChoice(choice);
    setHasSelected(true);
    makeChoice(choice);
  };
  
  // Calculate scores
  const playerScore = rounds.filter(round => round.result === 'win').length;
  const opponentScore = rounds.filter(round => round.result === 'loss').length;
  
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-400">You</div>
          <div className="text-2xl font-bold text-white">{playerScore}</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-medium text-gray-300">Round {currentRound + 1}</div>
          <div className="text-sm text-gray-400">Best of 3</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-400">
            {opponent?.twitterHandle ? `@${opponent.twitterHandle}` : 'Opponent'}
          </div>
          <div className="text-2xl font-bold text-white">{opponentScore}</div>
        </div>
      </div>
      
      {/* Previous rounds results */}
      {rounds.length > 0 && (
        <div className="mb-6">
          {rounds.map((round, index) => (
            <GameResult key={index} round={round} roundNumber={index + 1} />
          ))}
        </div>
      )}
      
      {/* Current round */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white mb-2">
          {hasSelected 
            ? "Waiting for opponent..." 
            : "Make your choice:"}
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          <GameChoiceComponent
            choice="rock"
            selected={selectedChoice === 'rock'}
            disabled={hasSelected}
            onSelect={handleSelect}
          />
          <GameChoiceComponent
            choice="paper"
            selected={selectedChoice === 'paper'}
            disabled={hasSelected}
            onSelect={handleSelect}
          />
          <GameChoiceComponent
            choice="scissors"
            selected={selectedChoice === 'scissors'}
            disabled={hasSelected}
            onSelect={handleSelect}
          />
        </div>
      </div>
      
      {hasSelected && (
        <div className="text-center text-gray-400 animate-pulse">
          Waiting for opponent to choose...
        </div>
      )}
    </div>
  );
} 