'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name?: string;
  twitterHandle?: string;
  eloRating: number;
  totalWins: number;
  totalLosses: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState(0);

  useEffect(() => {
    // If not authenticated, redirect to home
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    // Wait for session to load
    if (status === 'loading') return;

    // Loading animation phases
    const phaseInterval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % 3);
    }, 800);

    async function fetchProfile() {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/user/${session.user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const userData = await response.json();
        setProfile({
          id: userData.id,
          name: userData.name,
          twitterHandle: userData.twitterHandle,
          eloRating: userData.eloRating,
          totalWins: userData.totalWins,
          totalLosses: userData.totalLosses,
          createdAt: userData.createdAt,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    }

    fetchProfile();

    return () => clearInterval(phaseInterval);
  }, [session, status, router]);

  if (loading) {
    const loadingMessages = [
      "Excavating ancient records...",
      "Unearthing your wonders...",
      "Calculating your conquests..."
    ];

    return (
      <div className="min-h-screen bg-gray-900 py-12 flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-block relative w-24 h-24">
              {/* Spinning wonder silhouette */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-2 border-yellow-400 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            {loadingMessages[loadingPhase]}
          </h2>
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-yellow-400 rounded-full animate-pulse"
              style={{ width: `${(loadingPhase + 1) * 33}%`, transition: 'width 0.5s ease-in-out' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              {error || "Profile not found"}
            </h2>
            <p className="mt-4 text-xl text-gray-400">
              We couldn't load your profile information.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl leading-6 font-medium text-white">
                {profile.name || profile.twitterHandle ? (
                  <>
                    {profile.name && <span>{profile.name}</span>}
                    {profile.twitterHandle && (
                      <span className="ml-2 text-gray-400">@{profile.twitterHandle}</span>
                    )}
                  </>
                ) : (
                  "My Profile"
                )}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-400">
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link
              href="/profile/edit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit Profile
            </Link>
          </div>
          <div className="border-t border-gray-700">
            <dl>
              <div className="bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-300">ELO Rating</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  {profile.eloRating}
                </dd>
              </div>
              <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-300">Total Wins</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  {profile.totalWins}
                </dd>
              </div>
              <div className="bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-300">Total Losses</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  {profile.totalLosses}
                </dd>
              </div>
              <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-300">Win Rate</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  {profile.totalWins + profile.totalLosses > 0
                    ? `${Math.round(
                        (profile.totalWins / (profile.totalWins + profile.totalLosses)) * 100
                      )}%`
                    : "No games played"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-white">
              Recent Games
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-400">
              History of your last 5 games
            </p>
          </div>
          <div className="border-t border-gray-700">
            {/* Placeholder for recent games - will be implemented later */}
            <div className="px-4 py-5 sm:p-6 text-center text-gray-400">
              No recent games found
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 