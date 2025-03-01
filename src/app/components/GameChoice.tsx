'use client';

import { GameChoice as Choice } from '../lib/gameContext';

interface GameChoiceProps {
  choice: Choice;
  selected: boolean;
  disabled: boolean;
  onSelect: (choice: Choice) => void;
}

export default function GameChoice({ choice, selected, disabled, onSelect }: GameChoiceProps) {
  const getIcon = () => {
    switch (choice) {
      case 'rock':
        return '✊';
      case 'paper':
        return '✋';
      case 'scissors':
        return '✌️';
      default:
        return '';
    }
  };
  
  const getLabel = () => {
    return choice ? choice.charAt(0).toUpperCase() + choice.slice(1) : '';
  };
  
  return (
    <button
      onClick={() => onSelect(choice)}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center p-4 rounded-lg transition-all
        ${selected 
          ? 'bg-blue-600 text-white ring-2 ring-white' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span className="text-4xl mb-2">{getIcon()}</span>
      <span className="text-sm font-medium">{getLabel()}</span>
    </button>
  );
} 