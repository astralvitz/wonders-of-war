import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add CORS headers for socket.io
  if (request.nextUrl.pathname.startsWith('/api/socket')) {
    const response = NextResponse.next();
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  }
  
  return NextResponse.next();
}

// Configure the middleware to run only for the socket.io API route
export const config = {
  matcher: '/api/socket/:path*',
}; 