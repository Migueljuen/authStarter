//index.js
const express = require('express');
const cors = require('cors');
const port = 3000;
const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Login
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// User
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);


});