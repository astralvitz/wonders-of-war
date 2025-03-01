'use client';

import { SessionProvider as Provider } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
  session: any;
};

export default function SessionProvider({ children, session }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Provider session={session}>{children}</Provider>;
} 