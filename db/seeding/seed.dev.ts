import { SeederModule } from './seeder.module';

(async () => {
  await SeederModule.run();
  console.log('\nš±š± Dev DB seeded !! š±š±\n\n');
  process.exit();
})();
