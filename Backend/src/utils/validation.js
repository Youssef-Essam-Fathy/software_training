const { body, query, validationResult } = require('express-validator');

// Valid subject areas based on the university model
const VALID_SUBJECTS = [
    'AR',      // Academic Reputation
    'ER',      // Employer Reputation
    'FSR',     // Faculty Student Ratio
    'CPF',     // Citations per Faculty
    'IFR',     // International Faculty Ratio
    'ISR',     // International Student Ratio
    'ISD',     // International Research Network
    'IRN',     // Industry Research Network
    'EO',      // Employment Outcomes
    'SUS',     // Sustainability
    'Overall'  // Overall Score
];

// Valid weight subjects (excluding 'Overall' since it's the result)
const VALID_WEIGHT_SUBJECTS = [
    'AR',      // Academic Reputation
    'ER',      // Employer Reputation
    'FSR',     // Faculty Student Ratio
    'CPF',     // Citations per Faculty
    'IFR',     // International Faculty Ratio
    'ISR',     // International Student Ratio
    'ISD',     // International Research Network
    'IRN',     // Industry Research Network
    'EO',      // Employment Outcomes
    'SUS'      // Sustainability
];

// Valid regions (common university regions)
const VALID_REGIONS = [
    'Asia',
    'Europe',
    'North America',
    'South America',
    'Africa',
    'Middle East',
    'Oceania'
];

// Valid years for rankings
const VALID_YEARS = ['2025', '2026'];

// Validation rules for rankings endpoint
const validateRankingsQuery = [
    query('year')
        .optional()
        .isIn(VALID_YEARS)
        .withMessage('Year must be either 2025 or 2026'),
    
    query('region')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Region must be a string between 1 and 50 characters'),
    
    query('subject')
        .optional()
        .isIn(VALID_SUBJECTS)
        .withMessage(`Subject must be one of: ${VALID_SUBJECTS.join(', ')}`),
    
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be an integer between 1 and 100'),
    
    // Validate weights parameters
    query('weights')
        .optional()
        .isString()
        .withMessage('Weights must be a JSON string'),
    
    // Validate individual weight parameters
    ...VALID_WEIGHT_SUBJECTS.map(subject => 
        query(`weight_${subject}`)
            .optional()
            .isFloat({ min: 0, max: 100 })
            .withMessage(`${subject} weight must be a number between 0 and 100`)
    )
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            message: 'Invalid input parameters',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// Helper function to validate subject and get the corresponding score field
const validateSubject = (subject) => {
    if (!subject) return null;
    
    if (!VALID_SUBJECTS.includes(subject)) {
        throw new Error(`Invalid subject. Must be one of: ${VALID_SUBJECTS.join(', ')}`);
    }
    
    return `${subject} SCORE`;
};

// Helper function to validate region (case-insensitive)
const validateRegion = (region) => {
    if (!region) return null;
    
    // Check if the provided region matches any valid region (case-insensitive)
    const normalizedRegion = region.toLowerCase();
    const validRegion = VALID_REGIONS.find(r => r.toLowerCase() === normalizedRegion);
    
    if (!validRegion) {
        throw new Error(`Invalid region. Must be one of: ${VALID_REGIONS.join(', ')}`);
    }
    
    return validRegion;
};

// Helper function to validate year
const validateYear = (year) => {
    if (!year) return null;
    
    if (!VALID_YEARS.includes(year)) {
        throw new Error(`Invalid year. Must be one of: ${VALID_YEARS.join(', ')}`);
    }
    
    return year;
};

// Helper function to validate pagination parameters
const validatePagination = (page, limit) => {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    if (pageNum < 1) {
        throw new Error('Page must be a positive integer');
    }
    
    // Handle the case where limit is 0 (parseInt('0') returns 0, but we want to throw an error)
    if (limit === '0' || limitNum < 1 || limitNum > 100) {
        throw new Error('Limit must be between 1 and 100');
    }
    
    return { page: pageNum, limit: limitNum };
};

// Helper function to validate and parse weights
const validateWeights = (weights, weightParams) => {
    if (!weights && !weightParams) return null;
    
    let parsedWeights = {};
    
    // Parse weights from JSON string if provided
    if (weights) {
        try {
            parsedWeights = JSON.parse(weights);
        } catch (error) {
            throw new Error('Invalid weights JSON format');
        }
    }
    
    // Parse individual weight parameters if provided
    if (weightParams) {
        Object.keys(weightParams).forEach(key => {
            if (key.startsWith('weight_')) {
                const subject = key.replace('weight_', '');
                if (VALID_WEIGHT_SUBJECTS.includes(subject)) {
                    parsedWeights[subject] = parseFloat(weightParams[key]);
                }
            }
        });
    }
    
    // If no weights were parsed, return null
    if (Object.keys(parsedWeights).length === 0) {
        return null;
    }
    
    // Validate that all weights are valid subjects
    const invalidSubjects = Object.keys(parsedWeights).filter(
        subject => !VALID_WEIGHT_SUBJECTS.includes(subject)
    );
    
    if (invalidSubjects.length > 0) {
        throw new Error(`Invalid weight subjects: ${invalidSubjects.join(', ')}. Valid subjects: ${VALID_WEIGHT_SUBJECTS.join(', ')}`);
    }
    
    // Validate that weights are numbers between 0 and 100
    const invalidWeights = Object.entries(parsedWeights).filter(
        ([subject, weight]) => isNaN(weight) || weight < 0 || weight > 100
    );
    
    if (invalidWeights.length > 0) {
        throw new Error(`Invalid weights: ${invalidWeights.map(([subject, weight]) => `${subject}=${weight}`).join(', ')}. Weights must be numbers between 0 and 100.`);
    }
    
    // Calculate total weight
    const totalWeight = Object.values(parsedWeights).reduce((sum, weight) => sum + weight, 0);
    
    // Validate that total weight equals 100%
    if (Math.abs(totalWeight - 100) > 0.01) { // Allow small floating point precision errors
        throw new Error(`Total weights must equal 100%. Current total: ${totalWeight.toFixed(2)}%`);
    }
    
    return parsedWeights;
};

// Helper function to calculate composite score using weights
const calculateCompositeScore = (university, weights) => {
    if (!weights || Object.keys(weights).length === 0) {
        return university['Overall SCORE'];
    }
    
    let compositeScore = 0;
    let totalWeight = 0;
    
    Object.entries(weights).forEach(([subject, weight]) => {
        const scoreField = `${subject} SCORE`;
        const score = university[scoreField];
        
        if (score !== null && score !== undefined && !isNaN(score)) {
            compositeScore += (score * weight) / 100;
            totalWeight += weight;
        }
    });
    
    // If no valid scores found, return the original overall score
    if (totalWeight === 0) {
        return university['Overall SCORE'];
    }
    
    // Normalize by the actual total weight used
    return totalWeight > 0 ? (compositeScore * 100) / totalWeight : university['Overall SCORE'];
};

module.exports = {
    validateRankingsQuery,
    handleValidationErrors,
    validateSubject,
    validateRegion,
    validateYear,
    validatePagination,
    validateWeights,
    calculateCompositeScore,
    VALID_SUBJECTS,
    VALID_WEIGHT_SUBJECTS,
    VALID_REGIONS,
    VALID_YEARS
};
