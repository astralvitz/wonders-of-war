'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  // For now, we'll just have a placeholder since we can't actually edit much
  // In a real app, you would have form fields for editable profile data
  
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
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-2xl leading-6 font-medium text-white">
              Edit Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-400">
              Update your profile information
            </p>
          </div>
          <div className="border-t border-gray-700 px-4 py-5 sm:p-6">
            <div className="text-center text-gray-400 py-8">
              <p className="mb-4">
                Profile editing is not yet implemented.
              </p>
              <p>
                Your Twitter profile information is automatically synced when you sign in.
              </p>
              
              {message && (
                <div className="mt-4 p-3 bg-green-800 text-white rounded">
                  {message}
                </div>
              )}
              
              <div className="mt-8 flex justify-center space-x-4">
                <Link
                  href={`/profile/${session.user.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Back to Profile
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
    </div>
  );
} 