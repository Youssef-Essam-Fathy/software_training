// Test version of app.js without database dependency
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for testing
const mockUniversities = [
    {
        Index: 1,
        '2026 Rank': 1,
        '2025 Rank': 2,
        Name: 'Cairo University',
        Country: 'Egypt',
        Region: 'Middle East',
        Size: 'Large',
        Focus: 'Comprehensive',
        Research: 'Very High',
        Status: 'Public',
        'AR SCORE': 95.5,
        'AR RANK': 1,
        'ER SCORE': 90.0,
        'ER RANK': 2,
        'FSR SCORE': 88.5,
        'FSR RANK': 3,
        'CPF SCORE': 92.0,
        'CPF RANK': 1,
        'IFR SCORE': 87.0,
        'IFR RANK': 4,
        'ISR SCORE': 89.5,
        'ISR RANK': 2,
        'ISD SCORE': 91.0,
        'ISD RANK': 1,
        'IRN SCORE': 86.5,
        'IRN RANK': 5,
        'EO SCORE': 93.0,
        'EO RANK': 1,
        'SUS SCORE': 94.5,
        'SUS RANK': 1,
        'Overall SCORE': 90.5
    },
    {
        Index: 2,
        '2026 Rank': 2,
        '2025 Rank': 1,
        Name: 'Ain Shams University',
        Country: 'Egypt',
        Region: 'Middle East',
        Size: 'Large',
        Focus: 'Comprehensive',
        Research: 'Very High',
        Status: 'Public',
        'AR SCORE': 94.0,
        'AR RANK': 2,
        'ER SCORE': 91.0,
        'ER RANK': 1,
        'FSR SCORE': 89.0,
        'FSR RANK': 2,
        'CPF SCORE': 91.5,
        'CPF RANK': 2,
        'IFR SCORE': 88.0,
        'IFR RANK': 3,
        'ISR SCORE': 90.0,
        'ISR RANK': 1,
        'ISD SCORE': 90.5,
        'ISD RANK': 2,
        'IRN SCORE': 87.0,
        'IRN RANK': 4,
        'EO SCORE': 92.5,
        'EO RANK': 2,
        'SUS SCORE': 93.5,
        'SUS RANK': 2,
        'Overall SCORE': 91.0
    },
    {
        Index: 3,
        '2026 Rank': 3,
        '2025 Rank': 3,
        Name: 'Alexandria University',
        Country: 'Egypt',
        Region: 'Middle East',
        Size: 'Large',
        Focus: 'Comprehensive',
        Research: 'High',
        Status: 'Public',
        'AR SCORE': 92.5,
        'AR RANK': 3,
        'ER SCORE': 89.5,
        'ER RANK': 3,
        'FSR SCORE': 87.0,
        'FSR RANK': 4,
        'CPF SCORE': 90.0,
        'CPF RANK': 3,
        'IFR SCORE': 86.5,
        'IFR RANK': 5,
        'ISR SCORE': 88.5,
        'ISR RANK': 3,
        'ISD SCORE': 89.0,
        'ISD RANK': 3,
        'IRN SCORE': 85.5,
        'IRN RANK': 6,
        'EO SCORE': 91.0,
        'EO RANK': 3,
        'SUS SCORE': 92.0,
        'SUS RANK': 3,
        'Overall SCORE': 89.5
    }
];

// Mock ranking controller function
const getRankings = async (req, res) => {
    try {
        const { year, region, page = 1, limit = 10 } = req.query;
        
        // Filter data based on parameters
        let filteredData = [...mockUniversities];
        
        // Apply year filter
        if (year) {
            const yearRankField = `${year} Rank`;
            filteredData = filteredData.filter(uni => 
                uni[yearRankField] && uni[yearRankField] !== null
            );
        }
        
        // Apply region filter
        if (region) {
            filteredData = filteredData.filter(uni => 
                uni.Region.toLowerCase().includes(region.toLowerCase())
            );
        }
        
        // Calculate pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        
        // Sort data
        let sortField = 'Overall SCORE';
        if (year) {
            sortField = `${year} Rank`;
        }
        filteredData.sort((a, b) => a[sortField] - b[sortField]);
        
        // Apply pagination
        const paginatedData = filteredData.slice(skip, skip + limitNum);
        const total = filteredData.length;
        const totalPages = Math.ceil(total / limitNum);
        
        // Prepare response
        const response = {
            data: paginatedData,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            },
            filters: {
                year: year || null,
                region: region || null
            }
        };
        
        res.json(response);
        
    } catch (error) {
        console.error('Error fetching rankings:', error);
        res.status(500).json({ 
            error: 'Failed to fetch rankings',
            message: error.message 
        });
    }
};

// Routes
app.get('/api', (req, res) => {
    res.json(mockUniversities);
});

app.get('/api/rankings', getRankings);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 API endpoints available:`);
    console.log(`   GET /health - Health check`);
    console.log(`   GET /api - All universities`);
    console.log(`   GET /api/rankings - Rankings with filters and pagination`);
    console.log(`\n🔗 Test URLs:`);
    console.log(`   http://localhost:${PORT}/health`);
    console.log(`   http://localhost:${PORT}/api`);
    console.log(`   http://localhost:${PORT}/api/rankings`);
    console.log(`   http://localhost:${PORT}/api/rankings?year=2025&region=Middle%20East&page=1&limit=5`);
});
