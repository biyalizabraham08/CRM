const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes')
app.use(express.json());
const followUpRouters = require ('./routes/followupRoutes');
const  dashboardRoutes= require('./routes/dashboardRoutes')


// Routes
app.get('/', (req, res) => {
  res.send('Welcome to CRM Follow-up System API');
});

app.use('/api/auth', authRoutes);
app.use('/api/lead', leadRoutes);
app.use('/api/followup', followUpRouters);
app.use('/api/dashboard',dashboardRoutes);



module.exports = app;