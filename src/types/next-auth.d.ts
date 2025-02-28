import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    twitterHandle?: string | null;
    eloRating?: number;
  }

  interface Session {
    user: User & {
      id: string;
      twitterHandle?: string | null;
      eloRating?: number;
    };
  }
} 