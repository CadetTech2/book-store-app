const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: env.isDev ? '*' : process.env.CLIENT_URL,
  credentials: true,
}));
app.use(compression());
app.use(morgan(env.isDev ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isDev ? 1000 : 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api', limiter);

app.use('/uploads', express.static(path.resolve(env.upload.dir)));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'BookVault API is running' });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.use(errorHandler);

module.exports = app;
