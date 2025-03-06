const express = require('express');
const mongoose = require('mongoose');
const spaceOptimizationRoutes = require('./api/spaceOptimization');

// ... existing imports and middleware ...

// Add routes
app.use('/api', spaceOptimizationRoutes);

// ... rest of your server code ... 