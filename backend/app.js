const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const authRoutes    = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const moduleRoutes  = require('./routes/modules');

const app = express();
app.set('trust proxy', 1);


const assetsRoutes = require('./routes/assets');

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/api/assets', assetsRoutes);

app.use('/api/auth',    authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/modules', moduleRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;