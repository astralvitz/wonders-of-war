'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user?.id) {
      // Redirect to the user's profile page
      router.push(`/profile/${session.user.id}`);
    } else {
      // Redirect to home if not logged in
      router.push('/');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Loading profile...
          </h2>
        </div>
      </div>
    </div>
  );
} 