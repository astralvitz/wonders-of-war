import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Simple in-memory cache with expiration
const profileCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute cache TTL

// Define a type that matches our database schema
interface UserWithProfile {
  id: string;
  name?: string | null;
  image?: string | null;
  twitterHandle?: string | null;
  eloRating: number;
  totalWins: number;
  totalLosses: number;
  createdAt: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check cache before database query
    const cacheKey = `profile-${userId}`;
    if (profileCache.has(cacheKey)) {
      const { data, timestamp } = profileCache.get(cacheKey)!;
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log(`Cache hit for user profile: ${userId}`);
        return NextResponse.json(data);
      }
      console.log(`Cache expired for user profile: ${userId}`);
    }
    
    console.log(`Fetching user profile from database: ${userId}`);
    
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Cast the user to our interface to handle the type correctly
    const typedUser = user as unknown as UserWithProfile;
    
    // Format the response
    const userProfile = {
      id: typedUser.id,
      name: typedUser.name || undefined,
      image: typedUser.image || undefined,
      twitterHandle: typedUser.twitterHandle || undefined,
      eloRating: typedUser.eloRating,
      totalWins: typedUser.totalWins,
      totalLosses: typedUser.totalLosses,
      createdAt: typedUser.createdAt,
    };
    
    // Store in cache
    profileCache.set(cacheKey, { 
      data: userProfile, 
      timestamp: Date.now() 
    });
    
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
} 