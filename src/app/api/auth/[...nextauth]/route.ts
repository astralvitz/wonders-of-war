import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: null, // Twitter OAuth 2.0 doesn't provide email by default
          image: profile.data.profile_image_url,
          username: profile.data.username,
        };
      },
    }),
  ],
  debug: true, // Enable debug mode to see detailed errors
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { twitterHandle: true, eloRating: true }
        });
        session.user.twitterHandle = dbUser?.twitterHandle;
        session.user.eloRating = dbUser?.eloRating;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("Sign in attempt:", { 
        userId: user?.id,
        provider: account?.provider,
        username: account?.username || (profile as any)?.data?.username
      });
      
      if (account?.provider === 'twitter') {
        try {
          const twitterHandle = account.username || (profile as any)?.data?.username;
          if (user.id && twitterHandle) {
            await prisma.user.update({
              where: { id: user.id },
              data: { twitterHandle }
            });
          }
        } catch (error) {
          console.error('Error updating user:', error);
          // Continue even if update fails
        }
      }
      return true;
    }
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST }; 