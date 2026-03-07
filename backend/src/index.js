const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { initDatabase } = require('./config/init');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // Allow large base64 images
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Santiago Store API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'المسار غير موجود.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'خطأ داخلي في الخادم.' });
});

// Start server
async function start() {
  await testConnection();
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`\n Santiago Store API running on http://localhost:${PORT}`);
    console.log(` Admin credentials: username=admin, password=admin123\n`);
  });
}

start().catch(console.error);
