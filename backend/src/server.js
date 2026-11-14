require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const studentRoutes = require('./routes/students');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/students', studentRoutes);
app.use(errorHandler);

async function startServer() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required. Copy .env.example to .env and configure it.');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  app.listen(port, () => {
    console.log(`Student Management API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Could not start the API:', error.message);
  process.exit(1);
});
