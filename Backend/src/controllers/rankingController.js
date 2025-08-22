const University = require('../models/university.model');

const getRankings = async (req, res) => {
    try {
        const { year, region, page = 1, limit = 10 } = req.query;
        
        // Build filter object
        const filter = {};
        
        // Add year filter if provided
        if (year) {
            const yearRankField = `${year} Rank`;
            filter[yearRankField] = { $exists: true, $ne: null };
        }
        
        // Add region filter if provided
        if (region) {
            filter.Region = { $regex: new RegExp(region, 'i') };
        }
        
        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        
        // Build sort object based on year
        let sortField = 'Overall SCORE';
        if (year) {
            sortField = `${year} Rank`;
        }
        
        // Execute query with pagination
        const universities = await University.find(filter)
            .sort({ [sortField]: 1 })
            .skip(skip)
            .limit(limitNum)
            .select('-__v');
        
        // Get total count for pagination metadata
        const total = await University.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);
        
        // Prepare response
        const response = {
            data: universities,
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

module.exports = {
    getRankings
};
