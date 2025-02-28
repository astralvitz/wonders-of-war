# Wonders of War

A strategic 1v1 game where players race to build ancient wonders while defending against their opponent's attacks.

## Features

- **Turn-based Strategy**: Plan your moves carefully to either progress your wonder or hinder your opponent
- **Historic Wonders**: Choose from iconic wonders like the Great Pyramid, Colossus of Rhodes, and more
- **Real-time Multiplayer**: Challenge friends or random opponents
- **Competitive Ranking**: Climb the leaderboard with an ELO-based ranking system

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Prisma (PostgreSQL)
- NextAuth.js
- Socket.io
- Framer Motion

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wonders-of-war.git
cd wonders-of-war
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Fill in the required values:
  - Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
  - Get Twitter OAuth credentials from the [Twitter Developer Portal](https://developer.twitter.com)
  - Set up your PostgreSQL database and update `DATABASE_URL`

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

### Deploying to Vercel

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Add the environment variables in the Vercel project settings
4. Deploy!

### Database Setup

1. Create a PostgreSQL database (recommended: [Vercel Postgres](https://vercel.com/storage/postgres))
2. Update the `DATABASE_URL` in your environment variables
3. Run migrations:
```bash
npx prisma db push
```

## Game Rules

### Objective
- Be the first to complete your Wonder (21 turns of progress)
- Progress automatically increments each turn
- Choose actions to either speed up your progress or hinder your opponent

### Actions
1. **Attack** (2-3 turns):
   - Footsoldiers: Kill builders
   - Archers: Reduce progress
   - Trebuchet: Heavy progress reduction

2. **Defense** (2-3 turns):
   - Stone Wall: Blocks ground units
   - Ice Barrier: Temporary protection
   - Spellward: Magical defense

3. **Empower** (1-3 turns):
   - Extra Workers: Speed up progress
   - Weapon Forge: Enhance attacks
   - Inspire: Bonus progress

4. **Espionage** (2-4 turns):
   - Scout: Reveal enemy actions
   - Sabotage: Delay enemy progress

### Wonder Abilities
Each Wonder has unique abilities:
- Great Pyramid: Enhanced defenses
- Colossus of Rhodes: Stronger attacks
- Great Library: Faster espionage
- Statue of Liberty: Progress bonus
- Coliseum: Faster defenses

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
