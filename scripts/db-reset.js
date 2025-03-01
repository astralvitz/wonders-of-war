// scripts/db-reset.js
const { execSync } = require('child_process');

console.log('🔄 Resetting database schema...');

try {
  // Run prisma db push with --force-reset flag
  execSync('npx prisma db push --force-reset --accept-data-loss', { stdio: 'inherit' });
  console.log('✅ Database schema reset successfully!');
} catch (error) {
  console.error('❌ Failed to reset database schema:');
  console.error(error);
  process.exit(1);
}

console.log('🔄 Generating Prisma client...');

try {
  // Generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully!');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:');
  console.error(error);
  process.exit(1);
}

console.log('🎉 Database reset complete!'); 