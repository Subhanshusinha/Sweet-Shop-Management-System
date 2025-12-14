const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic Route for Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Sweet Shop API' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/sweets', require('./routes/sweets'));


module.exports = app;
