import { SeederModule } from './seeder.module';

(async () => {
  await SeederModule.run();
  console.log('\n🌱🌱 Dev DB seeded !! 🌱🌱\n\n');
  process.exit();
})();
