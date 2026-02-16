const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
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
const dashboardRoutes = require('../routes/dashboard');
const attendanceRoutes = require('../routes/attendance');
const examsRoutes = require('../routes/exams');
const feesRoutes = require('../routes/fees');
const gradesRoutes = require('../routes/grades');
const tasksRoutes = require('../routes/tasks');
const teachersRoutes = require('../routes/teachers');
const studentsRoutes = require('../routes/students');
const auth = require('../routes/auth');

// Load env vars from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Set default API version if not provided
if (!process.env.API_VERSION) {
  process.env.API_VERSION = 'v1';
}

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
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/students', studentsRoutes);

app.use(`/api/${process.env.API_VERSION}/auth`, auth);

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
  console.log(`Server running on port ${PORT}`);
  console.log(`MIS System ready at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
