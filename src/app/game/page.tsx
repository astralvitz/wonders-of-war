'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GameProvider, useGame } from '../lib/gameContext';
import GameLobby from '../components/GameLobby';
import GameCountdown from '../components/GameCountdown';
import GamePlay from '../components/GamePlay';
import GameFinished from '../components/GameFinished';
import GameError from '../components/GameError';

function GameContent() {
  const { gameStatus } = useGame();
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if not logged in
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Loading...
            </h2>
          </div>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Rock Paper Scissors
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400 sm:mt-4">
            Best of 3 wins!
          </p>
        </div>
        
        {/* Render different components based on game status */}
        {gameStatus === 'waiting' || gameStatus === 'connecting' ? (
          <GameLobby />
        ) : gameStatus === 'countdown' ? (
          <GameCountdown />
        ) : gameStatus === 'playing' ? (
          <GamePlay />
        ) : gameStatus === 'finished' ? (
          <GameFinished />
        ) : gameStatus === 'error' ? (
          <GameError />
        ) : null}
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
} 