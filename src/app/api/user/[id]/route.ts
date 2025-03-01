import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Define the user type based on the Prisma schema
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
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Cast the user to our interface
    const userWithProfile = user as unknown as UserWithProfile;
    
    // Format the response
    const userProfile = {
      id: userWithProfile.id,
      name: userWithProfile.name || undefined,
      image: userWithProfile.image || undefined,
      twitterHandle: userWithProfile.twitterHandle || undefined,
      eloRating: userWithProfile.eloRating,
      totalWins: userWithProfile.totalWins,
      totalLosses: userWithProfile.totalLosses,
      createdAt: userWithProfile.createdAt,
    };
    
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
} 