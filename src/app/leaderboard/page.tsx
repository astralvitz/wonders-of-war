'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeaderboardUser {
  id: string;
  name?: string;
  twitterHandle?: string;
  eloRating: number;
  totalWins: number;
  totalLosses: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch this from an API
    // For now, we'll just use placeholder data
    const placeholderData: LeaderboardUser[] = [
      {
        id: '1',
        name: 'Alexander the Great',
        twitterHandle: 'alexander',
        eloRating: 2100,
        totalWins: 42,
        totalLosses: 0,
      },
      {
        id: '2',
        name: 'Julius Caesar',
        twitterHandle: 'caesar',
        eloRating: 1950,
        totalWins: 35,
        totalLosses: 5,
      },
      {
        id: '3',
        name: 'Cleopatra',
        twitterHandle: 'cleopatra',
        eloRating: 1900,
        totalWins: 30,
        totalLosses: 8,
      },
      {
        id: '4',
        name: 'Genghis Khan',
        twitterHandle: 'khan',
        eloRating: 1850,
        totalWins: 28,
        totalLosses: 10,
      },
      {
        id: '5',
        name: 'Napoleon Bonaparte',
        twitterHandle: 'napoleon',
        eloRating: 1800,
        totalWins: 25,
        totalLosses: 12,
      },
      {
        id: '6',
        name: 'Queen Victoria',
        twitterHandle: 'victoria',
        eloRating: 1750,
        totalWins: 22,
        totalLosses: 15,
      },
      {
        id: '7',
        name: 'Ramses II',
        twitterHandle: 'ramses',
        eloRating: 1700,
        totalWins: 20,
        totalLosses: 18,
      },
      {
        id: '8',
        name: 'Charlemagne',
        twitterHandle: 'charlemagne',
        eloRating: 1650,
        totalWins: 18,
        totalLosses: 20,
      },
      {
        id: '9',
        name: 'Attila the Hun',
        twitterHandle: 'attila',
        eloRating: 1600,
        totalWins: 15,
        totalLosses: 22,
      },
      {
        id: '10',
        name: 'Saladin',
        twitterHandle: 'saladin',
        eloRating: 1550,
        totalWins: 12,
        totalLosses: 25,
      },
    ];
    
    setUsers(placeholderData);
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Loading leaderboard...
            </h2>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Leaderboard
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400 sm:mt-4">
            The greatest wonder builders of all time
          </p>
        </div>
        
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Player
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ELO Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    W/L
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Win Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-750' : 'bg-gray-800'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <Link href={`/profile/${user.id}`} className="hover:text-blue-400">
                        {user.name}
                        {user.twitterHandle && (
                          <span className="text-gray-500 ml-1">@{user.twitterHandle}</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.eloRating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.totalWins} / {user.totalLosses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.totalWins + user.totalLosses > 0
                        ? `${Math.round(
                            (user.totalWins / (user.totalWins + user.totalLosses)) * 100
                          )}%`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 