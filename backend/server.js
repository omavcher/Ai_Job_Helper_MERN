const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();


const app = express();

// Middleware
// app.use(cors({
//   origin: 'https://ai-job-helper-mern.vercel.app', // Replace with your frontend URL if different
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));


app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL if different
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Parse incoming JSON requests
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging HTTP requests
app.use(rateLimit({ // Rate limiting to prevent abuse
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.log('MongoDB connection error:', err);
    setTimeout(() => mongoose.connect(process.env.MONGO_URI), 5000); // Retry connection
  });

// Routes
const aiRoutes = require('./routes/aiRoutes');
const codeRoutes = require('./routes/codeRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require("./routes/payment.js");
app.use("/api/payment", paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/auth', authRoutes);


// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.get('/', (req, res) => {
  res.send('This is the backend server for the AI Job Helper MERN app.');
}
);