 const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDatabase = require('./config/db.js');

// الاتصال بقاعدة البيانات
connectDatabase();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// التعامل مع الأخطاء غير المعالجة
process.on('unhandledRejection', (err, promise) => {
  console.log('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

module.exports = server;
