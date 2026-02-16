const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('../config/database');
const errorHandler = require('../middlewares/errorHandler');
const logger = require('../config/logger');

const classRoutes = require('../routes/classes');
const subjectRoutes = require('../routes/subjects');
const libraryRoutes = require('../routes/library');
const announcementRoutes = require('../routes/announcements');
const eventRoutes = require('../routes/events');
const leaveRoutes = require('../routes/leave');
const notificationRoutes = require('../routes/notifications');
const auth = require('../routes/auth');
// const users = require('../routes/users');
// const departments = require('../routes/departments');
// const projects = require('../routes/projects');
// const tasks = require('../routes/tasks');
// const attendance = require('../routes/attendance');

// Load env vars
dotenv.config();

// Initialize app (MUST be before app.use())
const app = express();

// Connect to database
connectDB();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(`/api/${process.env.API_VERSION}/auth`, auth);
app.use(`/api/${process.env.API_VERSION}/users`, users);
app.use(`/api/${process.env.API_VERSION}/departments`, departments);
app.use(`/api/${process.env.API_VERSION}/projects`, projects);
app.use(`/api/${process.env.API_VERSION}/tasks`, tasks);
app.use(`/api/${process.env.API_VERSION}/attendance`, attendance);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MIS System is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to MIS API',
    version: process.env.API_VERSION,
    documentation: '/api-docs'
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 MIS System ready at http://localhost:${PORT}`);
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections (single listener)
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
