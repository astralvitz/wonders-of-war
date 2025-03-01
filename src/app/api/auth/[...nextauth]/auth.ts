import TwitterProvider from 'next-auth/providers/twitter';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import type { NextAuthOptions } from 'next-auth';

// Define the Twitter profile type
interface TwitterProfileData {
  data: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
  };
}

const prisma = new PrismaClient();

// Use a consistent secret
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      profile(profile: TwitterProfileData) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: null,
          image: profile.data.profile_image_url,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // Use JWT strategy instead of database to avoid conflicts
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true, // Enable debug mode to see detailed errors
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Add user info to the token right after sign in
        token.userId = user.id;
        token.twitterHandle = null;
        token.eloRating = 1500;
        
        if (account.provider === 'twitter') {
          try {
            const twitterHandle = (account as any).username || (account as any).profile?.data?.username;
            if (twitterHandle) {
              // Update user in database
              await prisma.user.update({
                where: { id: user.id },
                data: { twitterHandle }
              }).catch(error => {
                console.error('Error updating user:', error);
              });
              
              // Add to token
              token.twitterHandle = twitterHandle;
            }
          } catch (error) {
            console.error('Error in JWT callback:', error);
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Add properties to session from token
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.twitterHandle = token.twitterHandle as string | null;
        session.user.eloRating = token.eloRating as number | undefined;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("Sign in attempt:", { 
        userId: user?.id,
        provider: account?.provider,
        username: account?.username || (profile as any)?.data?.username
      });
      
      return true;
    }
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/auth/error',
  },
}; 