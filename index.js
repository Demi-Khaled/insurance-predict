require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Improve CORS for production
app.use(cors({
  origin: '*', // You can restrict this to your frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Make the uploads folder accessible statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/records', require('./routes/records'));

// Simple health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', database: 'connected' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('InsurePredict AI API is running!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Connect to DB then start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`InsurePredict AI Backend listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
