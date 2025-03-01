const { execSync } = require('child_process');

console.log('🔄 Pushing database schema...');

try {
  // Run prisma db push with --accept-data-loss flag
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('✅ Database schema pushed successfully!');
} catch (error) {
  console.error('❌ Failed to push database schema:');
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

console.log('🎉 Database setup complete!'); 