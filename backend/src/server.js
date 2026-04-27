const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { ensureAdminSeed } = require('./controllers/authController');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database
connectDB().then(() => {
  ensureAdminSeed().catch((err) =>
    console.error('Error seeding admin user:', err.message)
  );
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Student Management API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

