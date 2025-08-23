const request = require('supertest');
const express = require('express');
const { getRankings } = require('../../controllers/rankingController');

// Mock the University model
jest.mock('../../models/university.model');
const University = require('../../models/university.model');

// Mock the validation module
jest.mock('../../utils/validation', () => ({
    validateSubject: jest.fn(),
    validateRegion: jest.fn(),
    validateYear: jest.fn(),
    validatePagination: jest.fn(),
    validateWeights: jest.fn(),
    calculateCompositeScore: jest.fn()
}));

const { validateSubject, validateRegion, validateYear, validatePagination, validateWeights, calculateCompositeScore } = require('../../utils/validation');

describe('Ranking Routes', () => {
    let app;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Default mock implementations
        validateYear.mockReturnValue(null);
        validateRegion.mockReturnValue(null);
        validateSubject.mockReturnValue(null);
        validatePagination.mockReturnValue({ page: 1, limit: 10 });
        validateWeights.mockReturnValue(null);

        // Mock University model methods
        University.find = jest.fn();
        University.countDocuments = jest.fn();

        // Create test app that directly uses the controller
        app = express();
        app.use(express.json());
        app.get('/api/rankings', getRankings);
    });

    describe('GET /api/rankings', () => {
        test('should return universities with default pagination', async () => {
            const mockUniversities = [
                { Name: 'University A', 'Overall SCORE': 95 },
                { Name: 'University B', 'Overall SCORE': 90 }
            ];

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue(mockUniversities)
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(2);

            const response = await request(app)
                .get('/api/rankings')
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('pagination');
            expect(response.body).toHaveProperty('filters');
            expect(response.body.data).toHaveLength(2);
            expect(response.body.pagination.currentPage).toBe(1);
            expect(response.body.pagination.totalItems).toBe(2);
        });

        test('should handle year filter', async () => {
            validateYear.mockReturnValue('2025');

            const mockUniversities = [
                { Name: 'University A', '2025 Rank': 1 },
                { Name: 'University B', '2025 Rank': 2 }
            ];

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue(mockUniversities)
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(2);

            const response = await request(app)
                .get('/api/rankings?year=2025')
                .expect(200);

            expect(University.find).toHaveBeenCalledWith({
                '2025 Rank': { $exists: true, $ne: null }
            });
            expect(response.body.filters.year).toBe('2025');
        });

        test('should handle region filter', async () => {
            validateRegion.mockReturnValue('Middle East');

            const mockUniversities = [
                { Name: 'University A', Region: 'Middle East' },
                { Name: 'University B', Region: 'Middle East' }
            ];

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue(mockUniversities)
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(2);

            const response = await request(app)
                .get('/api/rankings?region=Middle East')
                .expect(200);

            expect(University.find).toHaveBeenCalledWith({
                Region: { $regex: new RegExp('Middle East', 'i') }
            });
            expect(response.body.filters.region).toBe('Middle East');
        });

        test('should handle subject filter', async () => {
            validateSubject.mockReturnValue('AR SCORE');

            const mockUniversities = [
                { Name: 'University A', 'AR SCORE': 95 },
                { Name: 'University B', 'AR SCORE': 90 }
            ];

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue(mockUniversities)
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(2);

            const response = await request(app)
                .get('/api/rankings?subject=AR')
                .expect(200);

            expect(University.find).toHaveBeenCalledWith({
                'AR SCORE': { $exists: true, $ne: null }
            });
            expect(response.body.filters.subject).toBe('AR');
        });

        test('should handle combined filters', async () => {
            validateYear.mockReturnValue('2026');
            validateRegion.mockReturnValue('Asia');
            validateSubject.mockReturnValue('ER SCORE');
            validatePagination.mockReturnValue({ page: 1, limit: 5 });

            const mockUniversities = [
                { Name: 'University A', '2026 Rank': 1, Region: 'Asia', 'ER SCORE': 95 }
            ];

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue(mockUniversities)
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/rankings?year=2026&region=Asia&subject=ER&page=1&limit=5')
                .expect(200);

            expect(University.find).toHaveBeenCalledWith({
                '2026 Rank': { $exists: true, $ne: null },
                Region: { $regex: new RegExp('Asia', 'i') },
                'ER SCORE': { $exists: true, $ne: null }
            });
            expect(response.body.filters.year).toBe('2026');
            expect(response.body.filters.region).toBe('Asia');
            expect(response.body.filters.subject).toBe('ER');
        });

        test('should handle pagination', async () => {
            validatePagination.mockReturnValue({ page: 2, limit: 10 });

            const mockUniversities = [
                { Name: 'University F', 'Overall SCORE': 85 },
                { Name: 'University G', 'Overall SCORE': 80 }
            ];

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue(mockUniversities)
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(15);

            const response = await request(app)
                .get('/api/rankings?page=2&limit=10')
                .expect(200);

            expect(response.body.pagination).toEqual({
                currentPage: 2,
                totalPages: 2,
                totalItems: 15,
                itemsPerPage: 10,
                hasNextPage: false,
                hasPrevPage: true
            });
        });

        test('should handle empty result set', async () => {
            validateRegion.mockReturnValue('NonExistentRegion');

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue([])
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(0);

            const response = await request(app)
                .get('/api/rankings?region=NonExistentRegion')
                .expect(200);

            expect(response.body.data).toHaveLength(0);
            expect(response.body.pagination.totalItems).toBe(0);
        });

        test('should handle database errors gracefully', async () => {
            const dbError = new Error('Database connection failed');
            University.find.mockImplementation(() => {
                throw dbError;
            });

            const response = await request(app)
                .get('/api/rankings')
                .expect(500);

            expect(response.body).toEqual({
                error: 'Failed to fetch rankings',
                message: 'Database connection failed'
            });
        });

        test('should handle validation errors', async () => {
            validateYear.mockImplementation(() => {
                throw new Error('Invalid year. Must be one of: 2025, 2026');
            });

            const response = await request(app)
                .get('/api/rankings?year=invalid')
                .expect(400);

            expect(response.body).toEqual({
                error: 'Validation failed',
                message: 'Invalid year. Must be one of: 2025, 2026'
            });
        });

        test('should handle URL encoding in region parameter', async () => {
            validateRegion.mockReturnValue('Middle East');

            const mockUniversities = [
                { Name: 'University A', Region: 'Middle East' }
            ];

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue(mockUniversities)
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/rankings?region=Middle%20East')
                .expect(200);

            expect(University.find).toHaveBeenCalledWith({
                Region: { $regex: new RegExp('Middle East', 'i') }
            });
            expect(response.body.filters.region).toBe('Middle East');
        });

        test('should handle case-insensitive region search', async () => {
            validateRegion.mockReturnValue('Asia');

            const mockUniversities = [
                { Name: 'University A', Region: 'Asia' }
            ];

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue(mockUniversities)
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/rankings?region=asia')
                .expect(200);

            expect(University.find).toHaveBeenCalledWith({
                Region: { $regex: new RegExp('Asia', 'i') }
            });
            expect(response.body.filters.region).toBe('Asia');
        });

        test('should handle subject score sorting when no year provided', async () => {
            validateSubject.mockReturnValue('ER SCORE');

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue([])
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(0);

            const response = await request(app)
                .get('/api/rankings?subject=ER')
                .expect(200);

            expect(University.find().sort).toHaveBeenCalledWith({ 'ER SCORE': 1 });
        });

        test('should prioritize year rank over subject score when both provided', async () => {
            validateYear.mockReturnValue('2025');
            validateSubject.mockReturnValue('AR SCORE');

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue([])
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(0);

            const response = await request(app)
                .get('/api/rankings?year=2025&subject=AR')
                .expect(200);

            expect(University.find().sort).toHaveBeenCalledWith({ '2025 Rank': 1 });
        });

        test('should handle weights parameter', async () => {
            const weights = { AR: 50, ER: 50 };
            validateWeights.mockReturnValue(weights);
            calculateCompositeScore
                .mockReturnValueOnce(84.2)
                .mockReturnValueOnce(79.5);

            const mockUniversities = [
                { Name: 'University A', toObject: () => ({ Name: 'University A' }) },
                { Name: 'University B', toObject: () => ({ Name: 'University B' }) }
            ];

            University.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue(mockUniversities)
                        })
                    })
                })
            });

            University.countDocuments.mockResolvedValue(2);

            const response = await request(app)
                .get('/api/rankings?weights=' + encodeURIComponent(JSON.stringify(weights)))
                .expect(200);

            expect(response.body.filters.weights).toEqual(weights);
            expect(response.body.data[0]['Composite SCORE']).toBe(84.2);
            expect(response.body.data[1]['Composite SCORE']).toBe(79.5);
        });
    });
});
