'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
        
        <div className="bg-gray-700 p-4 rounded mb-6">
          <p className="text-white">
            {error === 'OAuthSignin' && 'Error starting the sign in process.'}
            {error === 'OAuthCallback' && 'Error processing the authentication response.'}
            {error === 'OAuthCreateAccount' && 'Error creating a user account.'}
            {error === 'EmailCreateAccount' && 'Error creating a user account.'}
            {error === 'Callback' && 'Error processing the authentication callback.'}
            {error === 'OAuthAccountNotLinked' && 'This account is already linked to another user.'}
            {error === 'EmailSignin' && 'Error sending the sign in email.'}
            {error === 'CredentialsSignin' && 'Invalid credentials.'}
            {error === 'SessionRequired' && 'You must be signed in to access this page.'}
            {!error && 'An unknown error occurred during authentication.'}
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link 
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 