'use client';

import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[75vh]">
        <div className="absolute top-0 w-full h-full bg-center bg-cover bg-gradient-to-b from-gray-900 to-gray-800" />
        <div className="container relative mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-white font-semibold text-5xl mb-8">
                  Build Your Wonder, Conquer Your Enemy
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                  A strategic 1v1 game where you race to build ancient wonders while defending against
                  your opponent's attacks. Choose your wonder, plan your strategy, and make history.
                </p>
                {!session ? (
                  <button
                    onClick={() => signIn('twitter')}
                    className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
                  >
                    Start Your Journey
                  </button>
                ) : (
                  <Link
                    href="/game"
                    className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
                  >
                    Play Now
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="pb-20 bg-gray-900 -mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            <motion.div
              className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative flex flex-col min-w-0 break-words bg-gray-800 w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                    <i className="fas fa-award"></i>
                  </div>
                  <h6 className="text-xl text-white font-semibold">Strategic Gameplay</h6>
                  <p className="mt-2 mb-4 text-gray-400">
                    Plan your moves carefully. Build, defend, or attack - every decision matters in your
                    quest for victory.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-4/12 px-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative flex flex-col min-w-0 break-words bg-gray-800 w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                    <i className="fas fa-retweet"></i>
                  </div>
                  <h6 className="text-xl text-white font-semibold">Historic Wonders</h6>
                  <p className="mt-2 mb-4 text-gray-400">
                    Choose from iconic wonders of the ancient world, each with unique abilities and
                    strategies.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="pt-6 w-full md:w-4/12 px-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative flex flex-col min-w-0 break-words bg-gray-800 w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                    <i className="fas fa-fingerprint"></i>
                  </div>
                  <h6 className="text-xl text-white font-semibold">Competitive Ranking</h6>
                  <p className="mt-2 mb-4 text-gray-400">
                    Climb the leaderboard, improve your ELO rating, and become a legendary builder.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
