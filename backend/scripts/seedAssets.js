require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Asset    = require('../models/Asset');

const assets = [
  { key: 'logo',    url: 'https://res.cloudinary.com/dwa4wcqyi/image/upload/q_auto/f_auto/v1779524009/IIITB-COMET-Logo_rslal8.png',   altText: 'IIITB COMET Logo' },
  { key: 'qr_code', url: 'https://your-cdn.com/upi-qr.png',       altText: 'UPI QR Code' },
  { key: 'banner',  url: 'https://your-cdn.com/fwc-banner.jpg',    altText: 'FWC Program Banner' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Asset.deleteMany({});
  await Asset.insertMany(assets);
  console.log('Assets seeded');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });