const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Expert } = require('./models');

(async () => {
  await sequelize.sync({ force: true });
  const passwordHash = await bcrypt.hash('password123', 10);

  const cats = await Category.bulkCreate([
    { name: 'Plumbing', description: 'Leaks, taps, pipes and fittings' },
    { name: 'Electrical', description: 'Wiring, fans, inverters and lights' },
    { name: 'Deep cleaning', description: 'Kitchens, bathrooms and full homes' },
    { name: 'AC repair', description: 'Servicing, gas refill and installs' },
    { name: 'Carpentry', description: 'Doors, wardrobes and furniture repair' },
    { name: 'Painting', description: 'Interior and exterior walls' },
  ]);
  const c = Object.fromEntries(cats.map((x) => [x.name, x.id]));

  const experts = [
    ['Rohan Naik', 'rohan', 'Margao', 350, 9, 4.8, 'Plumbing', 'Fixes leaks, blocked drains and bathroom fittings. Brings his own parts.'],
    ['Savio Fernandes', 'savio', 'Varca', 400, 12, 4.9, 'Electrical', 'Licensed electrician for house wiring, fans and inverter setups.'],
    ['Maria Dias', 'maria', 'Benaulim', 300, 6, 4.7, 'Deep cleaning', 'Leads a two-person crew for kitchen and bathroom deep cleans.'],
    ['Imran Shaikh', 'imran', 'Margao', 500, 8, 4.6, 'AC repair', 'Services split and window ACs, gas refills and new installs.'],
    ['Joaquim Pereira', 'joaquim', 'Colva', 450, 15, 4.9, 'Carpentry', 'Builds and repairs wardrobes, doors and teak furniture.'],
    ['Dattaraj Gaonkar', 'dattaraj', 'Cavelossim', 320, 7, 4.5, 'Painting', 'Interior and exterior painting with damp-proof primer.'],
  ];
  for (const [name, handle, city, hourlyRate, yearsExperience, rating, cat, bio] of experts) {
    const user = await User.create({ name, email: `${handle}@doorstep.test`, passwordHash, role: 'expert' });
    await Expert.create({ name, userId: user.id, city, hourlyRate, yearsExperience, rating, categoryId: c[cat], bio });
  }
  await User.create({ name: 'Demo Customer', email: 'customer@doorstep.test', phone: '9999900000', passwordHash, role: 'customer' });

  console.log('Seeded. Demo logins (password: password123):');
  console.log('  customer@doorstep.test  (customer)');
  console.log('  savio@doorstep.test     (expert, also rohan@, maria@, imran@, joaquim@, dattaraj@)');
  process.exit();
})();
