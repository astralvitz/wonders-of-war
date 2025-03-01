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
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
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
    async signIn({ user, account }) {
      if (account?.provider === 'twitter' && typeof account.username === 'string') {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { twitterHandle: account.username }
          });
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