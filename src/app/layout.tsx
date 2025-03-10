import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'
import SessionProvider from './components/SessionProvider'
import Navbar from './components/ui/Navbar'
import { GameProvider } from './lib/gameContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Wonders of War',
  description: 'A strategic 1v1 game of wonder building and warfare',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const headersList = headers()

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <GameProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </GameProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
