import { SeederModule } from './seeder.module';

(async () => {
  await SeederModule.clean();
  console.log('\n🧹🧹 Dev DB cleaned !! 🧹🧹\n\n');
  process.exit();
})();
