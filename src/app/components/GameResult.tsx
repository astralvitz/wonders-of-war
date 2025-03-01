'use client';

import { GameRound, GameChoice, GameResult as Result } from '../lib/gameContext';

interface GameResultProps {
  round: GameRound;
  roundNumber: number;
}

export default function GameResult({ round, roundNumber }: GameResultProps) {
  const getChoiceIcon = (choice: GameChoice) => {
    switch (choice) {
      case 'rock':
        return '✊';
      case 'paper':
        return '✋';
      case 'scissors':
        return '✌️';
      default:
        return '❓';
    }
  };
  
  const getResultText = (result: Result) => {
    switch (result) {
      case 'win':
        return 'You Win!';
      case 'loss':
        return 'You Lose';
      case 'draw':
        return 'Draw';
      default:
        return '';
    }
  };
  
  const getResultColor = (result: Result) => {
    switch (result) {
      case 'win':
        return 'text-green-400';
      case 'loss':
        return 'text-red-400';
      case 'draw':
        return 'text-yellow-400';
      default:
        return '';
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="text-sm text-gray-400 mb-2">Round {roundNumber}</div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-1">{getChoiceIcon(round.playerChoice)}</span>
          <span className="text-xs text-gray-400">You</span>
        </div>
        
        <div className={`text-lg font-bold ${getResultColor(round.result)}`}>
          {getResultText(round.result)}
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-1">{getChoiceIcon(round.opponentChoice)}</span>
          <span className="text-xs text-gray-400">Opponent</span>
        </div>
      </div>
    </div>
  );
} 