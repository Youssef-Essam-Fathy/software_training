// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const University = require('./models/university.model');
const rankingRoutes = require('./routes/rankingRoutes');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', rankingRoutes);

app.get('/api', async (req, res) => {
    try {
        const universities = await University.find({});
        res.json(universities);
    } catch (error) {
        console.error('Error fetching universities:', error);
        res.status(500).json({ error: 'Failed to fetch universities' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
