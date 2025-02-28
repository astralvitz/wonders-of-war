import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const wonders = [
  {
    name: 'Great Pyramid',
    description: 'Enhanced defenses - All defensive structures gain +1 durability.',
  },
  {
    name: 'Colossus of Rhodes',
    description: 'Military might - All attacks deal +1 progress damage.',
  },
  {
    name: 'Great Library',
    description: 'Knowledge advantage - All espionage actions take 1 fewer turn to complete.',
  },
  {
    name: 'Statue of Liberty',
    description: 'Inspiration - Gain +1 progress every 5 turns automatically.',
  },
  {
    name: 'Coliseum',
    description: 'Roman efficiency - All defensive structures take 1 fewer turn to build.',
  },
];

async function main() {
  console.log('Start seeding...');

  for (const wonder of wonders) {
    const exists = await prisma.wonder.findUnique({
      where: { name: wonder.name },
    });

    if (!exists) {
      await prisma.wonder.create({
        data: wonder,
      });
      console.log(`Created wonder: ${wonder.name}`);
    } else {
      console.log(`Wonder already exists: ${wonder.name}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 