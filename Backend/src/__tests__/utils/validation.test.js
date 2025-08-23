const {
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
} = require('../../utils/validation');

describe('Validation Utils', () => {
    describe('validateSubject', () => {
        test('should return correct score field for valid subjects', () => {
            expect(validateSubject('AR')).toBe('AR SCORE');
            expect(validateSubject('ER')).toBe('ER SCORE');
            expect(validateSubject('FSR')).toBe('FSR SCORE');
            expect(validateSubject('CPF')).toBe('CPF SCORE');
            expect(validateSubject('IFR')).toBe('IFR SCORE');
            expect(validateSubject('ISR')).toBe('ISR SCORE');
            expect(validateSubject('ISD')).toBe('ISD SCORE');
            expect(validateSubject('IRN')).toBe('IRN SCORE');
            expect(validateSubject('EO')).toBe('EO SCORE');
            expect(validateSubject('SUS')).toBe('SUS SCORE');
            expect(validateSubject('Overall')).toBe('Overall SCORE');
        });

        test('should return null for empty or undefined subject', () => {
            expect(validateSubject('')).toBeNull();
            expect(validateSubject(null)).toBeNull();
            expect(validateSubject(undefined)).toBeNull();
        });

        test('should throw error for invalid subjects', () => {
            expect(() => validateSubject('INVALID')).toThrow('Invalid subject. Must be one of: AR, ER, FSR, CPF, IFR, ISR, ISD, IRN, EO, SUS, Overall');
            expect(() => validateSubject('ar')).toThrow('Invalid subject. Must be one of: AR, ER, FSR, CPF, IFR, ISR, ISD, IRN, EO, SUS, Overall');
            expect(() => validateSubject('123')).toThrow('Invalid subject. Must be one of: AR, ER, FSR, CPF, IFR, ISR, ISD, IRN, EO, SUS, Overall');
        });
    });

    describe('validateRegion', () => {
        test('should return correct region for valid regions (case-insensitive)', () => {
            expect(validateRegion('Asia')).toBe('Asia');
            expect(validateRegion('asia')).toBe('Asia');
            expect(validateRegion('ASIA')).toBe('Asia');
            expect(validateRegion('Middle East')).toBe('Middle East');
            expect(validateRegion('middle east')).toBe('Middle East');
            expect(validateRegion('MIDDLE EAST')).toBe('Middle East');
            expect(validateRegion('North America')).toBe('North America');
            expect(validateRegion('north america')).toBe('North America');
        });

        test('should return null for empty or undefined region', () => {
            expect(validateRegion('')).toBeNull();
            expect(validateRegion(null)).toBeNull();
            expect(validateRegion(undefined)).toBeNull();
        });

        test('should throw error for invalid regions', () => {
            expect(() => validateRegion('Invalid Region')).toThrow('Invalid region. Must be one of: Asia, Europe, North America, South America, Africa, Middle East, Oceania');
            expect(() => validateRegion('USA')).toThrow('Invalid region. Must be one of: Asia, Europe, North America, South America, Africa, Middle East, Oceania');
            expect(() => validateRegion('123')).toThrow('Invalid region. Must be one of: Asia, Europe, North America, South America, Africa, Middle East, Oceania');
        });
    });

    describe('validateYear', () => {
        test('should return correct year for valid years', () => {
            expect(validateYear('2025')).toBe('2025');
            expect(validateYear('2026')).toBe('2026');
        });

        test('should return null for empty or undefined year', () => {
            expect(validateYear('')).toBeNull();
            expect(validateYear(null)).toBeNull();
            expect(validateYear(undefined)).toBeNull();
        });

        test('should throw error for invalid years', () => {
            expect(() => validateYear('2024')).toThrow('Invalid year. Must be one of: 2025, 2026');
            expect(() => validateYear('2027')).toThrow('Invalid year. Must be one of: 2025, 2026');
            expect(() => validateYear('abc')).toThrow('Invalid year. Must be one of: 2025, 2026');
            expect(() => validateYear('2025.5')).toThrow('Invalid year. Must be one of: 2025, 2026');
        });
    });

    describe('validatePagination', () => {
        test('should return correct pagination for valid inputs', () => {
            expect(validatePagination('1', '10')).toEqual({ page: 1, limit: 10 });
            expect(validatePagination('5', '20')).toEqual({ page: 5, limit: 20 });
            expect(validatePagination('100', '50')).toEqual({ page: 100, limit: 50 });
        });

        test('should use default values for empty or undefined inputs', () => {
            expect(validatePagination('', '')).toEqual({ page: 1, limit: 10 });
            expect(validatePagination(null, null)).toEqual({ page: 1, limit: 10 });
            expect(validatePagination(undefined, undefined)).toEqual({ page: 1, limit: 10 });
            expect(validatePagination('', '20')).toEqual({ page: 1, limit: 20 });
            expect(validatePagination('5', '')).toEqual({ page: 5, limit: 10 });
        });

        test('should handle string inputs that can be parsed as integers', () => {
            expect(validatePagination('2', '15')).toEqual({ page: 2, limit: 15 });
            expect(validatePagination('0', '5')).toEqual({ page: 1, limit: 5 }); // 0 becomes 1 due to || 1
        });

        test('should throw error for invalid page numbers', () => {
            expect(() => validatePagination('-1', '10')).toThrow('Page must be a positive integer');
            expect(() => validatePagination('-5', '10')).toThrow('Page must be a positive integer');
        });

        test('should throw error for invalid limit values', () => {
            expect(() => validatePagination('1', '0')).toThrow('Limit must be between 1 and 100');
            expect(() => validatePagination('1', '-5')).toThrow('Limit must be between 1 and 100');
            expect(() => validatePagination('1', '101')).toThrow('Limit must be between 1 and 100');
            expect(() => validatePagination('1', '1000')).toThrow('Limit must be between 1 and 100');
        });

        test('should handle edge cases', () => {
            expect(validatePagination('1', '1')).toEqual({ page: 1, limit: 1 });
            expect(validatePagination('1', '100')).toEqual({ page: 1, limit: 100 });
            expect(validatePagination('999999', '50')).toEqual({ page: 999999, limit: 50 });
        });
    });

    describe('validateWeights', () => {
        test('should return null for no weights', () => {
            expect(validateWeights(null, null)).toBeNull();
            expect(validateWeights('', {})).toBeNull();
        });

        test('should parse valid JSON weights', () => {
            const weights = '{"AR": 30, "ER": 25, "FSR": 20, "CPF": 15, "IFR": 10}';
            const result = validateWeights(weights, null);
            expect(result).toEqual({
                AR: 30,
                ER: 25,
                FSR: 20,
                CPF: 15,
                IFR: 10
            });
        });

        test('should parse individual weight parameters', () => {
            const weightParams = {
                weight_AR: '30',
                weight_ER: '25',
                weight_FSR: '20',
                weight_CPF: '15',
                weight_IFR: '10'
            };
            const result = validateWeights(null, weightParams);
            expect(result).toEqual({
                AR: 30,
                ER: 25,
                FSR: 20,
                CPF: 15,
                IFR: 10
            });
        });

        test('should combine JSON and individual weights', () => {
            const weights = '{"AR": 30, "ER": 25}';
            const weightParams = {
                weight_FSR: '20',
                weight_CPF: '15',
                weight_IFR: '10'
            };
            const result = validateWeights(weights, weightParams);
            expect(result).toEqual({
                AR: 30,
                ER: 25,
                FSR: 20,
                CPF: 15,
                IFR: 10
            });
        });

        test('should throw error for invalid JSON format', () => {
            expect(() => validateWeights('{"AR": 30,}', null)).toThrow('Invalid weights JSON format');
        });

        test('should throw error for invalid weight subjects', () => {
            const weights = '{"INVALID": 30, "ER": 70}';
            expect(() => validateWeights(weights, null)).toThrow('Invalid weight subjects: INVALID. Valid subjects: AR, ER, FSR, CPF, IFR, ISR, ISD, IRN, EO, SUS');
        });

        test('should throw error for weights not equal to 100%', () => {
            const weights = '{"AR": 30, "ER": 25}';
            expect(() => validateWeights(weights, null)).toThrow('Total weights must equal 100%. Current total: 55.00%');
        });

        test('should throw error for weights outside 0-100 range', () => {
            const weights = '{"AR": 150, "ER": -50}';
            expect(() => validateWeights(weights, null)).toThrow('Invalid weights: AR=150, ER=-50. Weights must be numbers between 0 and 100.');
        });

        test('should allow small floating point precision errors', () => {
            const weights = '{"AR": 33.33, "ER": 33.33, "FSR": 33.34}';
            const result = validateWeights(weights, null);
            expect(result).toEqual({
                AR: 33.33,
                ER: 33.33,
                FSR: 33.34
            });
        });
    });

    describe('calculateCompositeScore', () => {
        const mockUniversity = {
            'AR SCORE': 85.5,
            'ER SCORE': 78.2,
            'FSR SCORE': 92.1,
            'CPF SCORE': 88.7,
            'IFR SCORE': 76.4,
            'ISR SCORE': 82.3,
            'ISD SCORE': 79.8,
            'IRN SCORE': 84.6,
            'EO SCORE': 87.9,
            'SUS SCORE': 81.2,
            'Overall SCORE': 83.5
        };

        test('should return original overall score when no weights provided', () => {
            const result = calculateCompositeScore(mockUniversity, null);
            expect(result).toBe(83.5);
        });

        test('should calculate composite score with weights', () => {
            const weights = {
                AR: 30,
                ER: 25,
                FSR: 20,
                CPF: 15,
                IFR: 10
            };
            const result = calculateCompositeScore(mockUniversity, weights);
            // Expected: (85.5*30 + 78.2*25 + 92.1*20 + 88.7*15 + 76.4*10) / 100 = 84.565
            expect(result).toBeCloseTo(84.565, 2);
        });

        test('should handle missing score fields', () => {
            const universityWithMissingScores = {
                ...mockUniversity,
                'AR SCORE': null,
                'ER SCORE': undefined
            };
            const weights = {
                AR: 30,
                ER: 25,
                FSR: 45
            };
            const result = calculateCompositeScore(universityWithMissingScores, weights);
            // Expected: (92.1*45) / 45 = 92.1 (only FSR score available)
            expect(result).toBeCloseTo(92.1, 2);
        });

        test('should return original overall score when no valid scores found', () => {
            const universityWithNoScores = {
                ...mockUniversity,
                'AR SCORE': null,
                'ER SCORE': undefined,
                'FSR SCORE': NaN
            };
            const weights = {
                AR: 30,
                ER: 25,
                FSR: 45
            };
            const result = calculateCompositeScore(universityWithNoScores, weights);
            expect(result).toBe(83.5);
        });

        test('should normalize by actual total weight used', () => {
            const weights = {
                AR: 50,
                ER: 50
            };
            const universityWithOneScore = {
                ...mockUniversity,
                'AR SCORE': 80,
                'ER SCORE': null
            };
            const result = calculateCompositeScore(universityWithOneScore, weights);
            // Expected: (80*50) / 50 = 80
            expect(result).toBe(80);
        });
    });

    describe('Constants', () => {
        test('should have correct VALID_SUBJECTS array', () => {
            expect(VALID_SUBJECTS).toEqual([
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
            ]);
        });

        test('should have correct VALID_WEIGHT_SUBJECTS array', () => {
            expect(VALID_WEIGHT_SUBJECTS).toEqual([
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
            ]);
        });

        test('should have correct VALID_REGIONS array', () => {
            expect(VALID_REGIONS).toEqual([
                'Asia',
                'Europe',
                'North America',
                'South America',
                'Africa',
                'Middle East',
                'Oceania'
            ]);
        });

        test('should have correct VALID_YEARS array', () => {
            expect(VALID_YEARS).toEqual(['2025', '2026']);
        });
    });

    describe('Integration Tests', () => {
        test('should handle multiple validations together', () => {
            const subject = validateSubject('AR');
            const region = validateRegion('Asia');
            const year = validateYear('2025');
            const pagination = validatePagination('1', '10');
            const weights = validateWeights('{"AR": 50, "ER": 50}', null);

            expect(subject).toBe('AR SCORE');
            expect(region).toBe('Asia');
            expect(year).toBe('2025');
            expect(pagination).toEqual({ page: 1, limit: 10 });
            expect(weights).toEqual({ AR: 50, ER: 50 });
        });

        test('should handle null values for all validations', () => {
            const subject = validateSubject(null);
            const region = validateRegion(null);
            const year = validateYear(null);
            const pagination = validatePagination(null, null);
            const weights = validateWeights(null, null);

            expect(subject).toBeNull();
            expect(region).toBeNull();
            expect(year).toBeNull();
            expect(pagination).toEqual({ page: 1, limit: 10 });
            expect(weights).toBeNull();
        });
    });
});
