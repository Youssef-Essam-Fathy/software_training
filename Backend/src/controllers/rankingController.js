const University = require('../models/university.model');
const { 
    validateSubject, 
    validateRegion, 
    validateYear, 
    validatePagination,
    validateWeights,
    calculateCompositeScore
} = require('../utils/validation');

const getRankings = async (req, res) => {
    try {
        const { year, region, subject, page = 1, limit = 10, weights, ...weightParams } = req.query;
        
        // Validate and process input parameters
        let validatedYear, validatedRegion, validatedSubject, validatedPagination, validatedWeights;
        
        try {
            validatedYear = validateYear(year);
            validatedRegion = validateRegion(region);
            validatedSubject = validateSubject(subject);
            validatedPagination = validatePagination(page, limit);
            validatedWeights = validateWeights(weights, weightParams);
        } catch (validationError) {
            return res.status(400).json({
                error: 'Validation failed',
                message: validationError.message
            });
        }
        
        // Build filter object
        const filter = {};
        
        // Add year filter if provided
        if (validatedYear) {
            const yearRankField = `${validatedYear} Rank`;
            filter[yearRankField] = { $exists: true, $ne: null };
        }
        
        // Add region filter if provided
        if (validatedRegion) {
            filter.Region = { $regex: new RegExp(validatedRegion, 'i') };
        }
        
        // Add subject filter if provided
        if (validatedSubject) {
            filter[validatedSubject] = { $exists: true, $ne: null };
        }
        
        // Calculate pagination
        const { page: pageNum, limit: limitNum } = validatedPagination;
        const skip = (pageNum - 1) * limitNum;
        
        // Build sort object based on year and subject
        let sortField = 'Overall SCORE';
        if (validatedYear) {
            sortField = `${validatedYear} Rank`;
        } else if (validatedSubject) {
            sortField = validatedSubject;
        }
        
        // Execute query with pagination
        const universities = await University.find(filter)
            .sort({ [sortField]: 1 })
            .skip(skip)
            .limit(limitNum)
            .select('-__v');
        
        // Calculate composite scores if weights are provided
        let processedUniversities = universities;
        if (validatedWeights) {
            processedUniversities = universities.map(university => {
                const compositeScore = calculateCompositeScore(university, validatedWeights);
                return {
                    ...university.toObject(),
                    'Composite SCORE': compositeScore
                };
            });
            
            // Re-sort by composite score if weights are provided and no other sort is specified
            if (!validatedYear && !validatedSubject) {
                processedUniversities.sort((a, b) => b['Composite SCORE'] - a['Composite SCORE']);
            }
        }
        
        // Get total count for pagination metadata
        const total = await University.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);
        
        // Prepare response
        const response = {
            data: processedUniversities,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            },
            filters: {
                year: validatedYear || null,
                region: validatedRegion || null,
                subject: subject || null,
                weights: validatedWeights || null
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
