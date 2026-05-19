const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
