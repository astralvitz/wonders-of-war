import 'next-auth';
import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    twitterHandle?: string | null;
    eloRating?: number;
    username?: string;
  }

  interface Session {
    user: User & DefaultSession['user'] & {
      id: string;
      twitterHandle?: string | null;
      eloRating?: number;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    twitterHandle?: string | null;
    eloRating?: number;
  }
}

declare module 'next-auth/providers/twitter' {
  interface TwitterProfile {
    data: {
      id: string;
      name: string;
      username: string;
      profile_image_url: string;
    };
  }
} 