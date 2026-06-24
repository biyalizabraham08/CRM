const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes')

app.use(cors());
app.use(express.json());
const followUpRouters = require ('./routes/followupRoutes');
const  dashboardRoutes= require('./routes/dashboardRoutes')


const path = require('path');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lead', leadRoutes);
app.use('/api/followup', followUpRouters);
app.use('/api/dashboard', dashboardRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Welcome to CRM Follow-up System API');
  });
}

module.exports = app;