'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function GamePage() {
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Game Coming Soon
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400 sm:mt-4">
            The game is currently under development. Check back soon!
          </p>
        </div>
        
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              Game Features
            </h3>
            <ul className="text-gray-300 space-y-2 mb-8">
              <li>• Turn-based strategy gameplay</li>
              <li>• Choose from historic wonders to build</li>
              <li>• Defend against opponent attacks</li>
              <li>• Use special abilities to gain advantages</li>
              <li>• Climb the competitive leaderboard</li>
            </ul>
            
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href="/leaderboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                View Leaderboard
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 