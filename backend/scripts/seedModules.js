require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const ModuleConfig = require('../models/ModuleConfig');

const modules = [
  {
    id: 1,
    name: 'Module 1',
    fee: 45000,
    hasTerms: false,
    fullFee: null,
    terms: [],
    active: true
  },
  {
    id: 2,
    name: 'Module 2',
    fee: null,
    hasTerms: true,
    fullFee: 75000,
    terms: [
      { id: 1, name: 'Term 1', fee: 45000 },
      { id: 2, name: 'Term 2', fee: 30000 },
      { id: 3, name: 'Full Payment', fee: 75000 }
    ],
    active: true
  },
  {
    id: 3,
    name: 'Module 3',
    fee: null,
    hasTerms: true,
    fullFee: 75000,
    terms: [
      { id: 1, name: 'Term 1', fee: 45000 },
      { id: 2, name: 'Term 2', fee: 30000 },
      { id: 3, name: 'Full Payment', fee: 75000 }
    ],
    active: true
  }
];

const seedModules = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in .env file');
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');

    await ModuleConfig.deleteMany({});
    console.log('Old modules removed');

    await ModuleConfig.insertMany(modules);
    console.log('Modules seeded successfully');

    process.exit(0);

  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seedModules();