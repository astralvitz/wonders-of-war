'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCallback } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleSignIn = useCallback(() => {
    signIn('twitter');
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Wonders of War
            </Link>
            {status === 'authenticated' && session && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/game"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Play
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Leaderboard
                </Link>
                <Link
                  href={`/profile/${session.user.id}`}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {status === 'authenticated' && session ? (
              <div className="flex items-center space-x-4">
                <div className="text-gray-300">
                  {session.user.twitterHandle && (
                    <span>@{session.user.twitterHandle}</span>
                  )}
                  {session.user.eloRating && (
                    <span className="ml-2">({session.user.eloRating} ELO)</span>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In with Twitter
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 