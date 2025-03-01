'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorDetails, setErrorDetails] = useState<{
    error: string | null;
    description: string;
  }>({
    error: null,
    description: 'Unknown authentication error'
  });

  useEffect(() => {
    const error = searchParams.get('error');
    let description = 'An unknown error occurred during authentication.';

    if (error === 'Configuration') {
      description = 'There is a problem with the server configuration. Please contact support.';
    } else if (error === 'AccessDenied') {
      description = 'You denied access to your Twitter account.';
    } else if (error === 'Callback') {
      description = 'There was a problem with the callback from Twitter. This could be due to mismatched callback URLs or incorrect OAuth settings.';
    } else if (error === 'OAuthSignin') {
      description = 'Error in the OAuth signing process.';
    } else if (error === 'OAuthCallback') {
      description = 'Error in the OAuth callback process.';
    } else if (error === 'OAuthCreateAccount') {
      description = 'Could not create OAuth account.';
    } else if (error === 'EmailCreateAccount') {
      description = 'Could not create email account.';
    } else if (error === 'Verification') {
      description = 'The token has expired or has already been used.';
    } else if (error) {
      description = `Authentication error: ${error}`;
    }

    setErrorDetails({ error, description });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <div className="mb-6">
          <p className="text-gray-700 mb-4">{errorDetails.description}</p>
          {errorDetails.error && (
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              Error code: {errorDetails.error}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Link 
            href="/"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
          >
            Return to Home
          </Link>
          <Link 
            href="/api/auth/signin"
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 text-center"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
} 