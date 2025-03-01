import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-5xl font-bold text-white mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-white mb-6">Page Not Found</h2>
      <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
} 