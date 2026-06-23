const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes')
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to CRM Follow-up System API');
});

app.use('/api/auth', authRoutes);
app.use('/api/lead', leadRoutes);


module.exports = app;