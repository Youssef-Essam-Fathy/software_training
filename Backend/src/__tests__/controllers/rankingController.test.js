const { getRankings } = require('../../controllers/rankingController');
const University = require('../../models/university.model');

// Mock the University model
jest.mock('../../models/university.model');

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

describe('Ranking Controller', () => {
  let mockReq;
  let mockRes;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      json: mockJson,
      status: mockStatus
    };
    mockReq = {
      query: {}
    };

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
  });

  describe('Query Parameters', () => {
        test('should handle no parameters with default pagination', async () => {
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

      await getRankings(mockReq, mockRes);

      expect(University.find).toHaveBeenCalledWith({});
      expect(University.find().sort).toHaveBeenCalledWith({ 'Overall SCORE': 1 });
      expect(mockJson).toHaveBeenCalledWith({
        data: mockUniversities,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        },
        filters: {
          year: null,
                    region: null,
                    subject: null,
                    weights: null
        }
      });
    });

    test('should handle year filter parameter', async () => {
      mockReq.query = { year: '2025' };
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

      await getRankings(mockReq, mockRes);

      expect(University.find).toHaveBeenCalledWith({
        '2025 Rank': { $exists: true, $ne: null }
      });
      expect(University.find().sort).toHaveBeenCalledWith({ '2025 Rank': 1 });
      expect(mockJson).toHaveBeenCalledWith({
        data: mockUniversities,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        },
        filters: {
          year: '2025',
                    region: null,
                    subject: null,
                    weights: null
        }
      });
    });

    test('should handle region filter parameter', async () => {
      mockReq.query = { region: 'Middle East' };
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

      await getRankings(mockReq, mockRes);

      expect(University.find).toHaveBeenCalledWith({
        Region: { $regex: new RegExp('Middle East', 'i') }
      });
      expect(mockJson).toHaveBeenCalledWith({
        data: mockUniversities,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        },
        filters: {
          year: null,
                    region: 'Middle East',
                    subject: null,
                    weights: null
                }
            });
        });

        test('should handle subject filter parameter', async () => {
            mockReq.query = { subject: 'AR' };
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

            await getRankings(mockReq, mockRes);

            expect(University.find).toHaveBeenCalledWith({
                'AR SCORE': { $exists: true, $ne: null }
            });
            expect(University.find().sort).toHaveBeenCalledWith({ 'AR SCORE': 1 });
            expect(mockJson).toHaveBeenCalledWith({
                data: mockUniversities,
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 2,
                    itemsPerPage: 10,
                    hasNextPage: false,
                    hasPrevPage: false
                },
                filters: {
                    year: null,
                    region: null,
                    subject: 'AR',
                    weights: null
        }
      });
    });

    test('should handle both year and region filters', async () => {
      mockReq.query = { year: '2026', region: 'Asia' };
            validateYear.mockReturnValue('2026');
            validateRegion.mockReturnValue('Asia');
      
      const mockUniversities = [
        { Name: 'University A', '2026 Rank': 1, Region: 'Asia' }
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

      await getRankings(mockReq, mockRes);

      expect(University.find).toHaveBeenCalledWith({
        '2026 Rank': { $exists: true, $ne: null },
        Region: { $regex: new RegExp('Asia', 'i') }
      });
      expect(mockJson).toHaveBeenCalledWith({
        data: mockUniversities,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        },
        filters: {
          year: '2026',
                    region: 'Asia',
                    subject: null,
                    weights: null
        }
      });
    });

        test('should handle year, region, and subject filters together', async () => {
            mockReq.query = { year: '2025', region: 'Europe', subject: 'ER' };
            validateYear.mockReturnValue('2025');
            validateRegion.mockReturnValue('Europe');
            validateSubject.mockReturnValue('ER SCORE');
      
      const mockUniversities = [
                { Name: 'University A', '2025 Rank': 1, Region: 'Europe', 'ER SCORE': 95 }
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

            await getRankings(mockReq, mockRes);

            expect(University.find).toHaveBeenCalledWith({
                '2025 Rank': { $exists: true, $ne: null },
                Region: { $regex: new RegExp('Europe', 'i') },
                'ER SCORE': { $exists: true, $ne: null }
            });
            expect(University.find().sort).toHaveBeenCalledWith({ '2025 Rank': 1 });
            expect(mockJson).toHaveBeenCalledWith({
                data: mockUniversities,
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 1,
                    itemsPerPage: 10,
                    hasNextPage: false,
                    hasPrevPage: false
                },
                filters: {
                    year: '2025',
                    region: 'Europe',
                    subject: 'ER',
                    weights: null
                }
            });
        });

        test('should handle pagination parameters', async () => {
            mockReq.query = { page: '2', limit: '5' };
            validatePagination.mockReturnValue({ page: 2, limit: 5 });

            const mockUniversities = [
                { Name: 'University F', 'Overall SCORE': 85 },
                { Name: 'University G', 'Overall SCORE': 80 }
            ];

            const mockSkip = jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                    select: jest.fn().mockResolvedValue(mockUniversities)
                })
            });

            const mockSort = jest.fn().mockReturnValue({
                skip: mockSkip
            });

            University.find.mockReturnValue({
                sort: mockSort
            });

            University.countDocuments.mockResolvedValue(15);

      await getRankings(mockReq, mockRes);

            expect(mockSkip).toHaveBeenCalledWith(5);
            expect(mockSort).toHaveBeenCalledWith({ 'Overall SCORE': 1 });
      expect(mockJson).toHaveBeenCalledWith({
        data: mockUniversities,
        pagination: {
          currentPage: 2,
                    totalPages: 3,
                    totalItems: 15,
          itemsPerPage: 5,
          hasNextPage: true,
          hasPrevPage: true
        },
        filters: {
          year: null,
                    region: null,
                    subject: null,
                    weights: null
        }
            });
      });
    });

    describe('Weights Functionality', () => {
        test('should calculate composite scores when weights are provided', async () => {
            const weights = { AR: 50, ER: 50 };
            mockReq.query = { weights: JSON.stringify(weights) };
            validateWeights.mockReturnValue(weights);
            calculateCompositeScore
                .mockReturnValueOnce(84.2) // First university
                .mockReturnValueOnce(79.5); // Second university

            const mockUniversities = [
                { Name: 'University A', 'AR SCORE': 85, 'ER SCORE': 83, toObject: () => ({ Name: 'University A', 'AR SCORE': 85, 'ER SCORE': 83 }) },
                { Name: 'University B', 'AR SCORE': 80, 'ER SCORE': 79, toObject: () => ({ Name: 'University B', 'AR SCORE': 80, 'ER SCORE': 79 }) }
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

      await getRankings(mockReq, mockRes);

            expect(validateWeights).toHaveBeenCalledWith(JSON.stringify(weights), {});
            expect(calculateCompositeScore).toHaveBeenCalledWith(mockUniversities[0], weights);
            expect(calculateCompositeScore).toHaveBeenCalledWith(mockUniversities[1], weights);
            
            const response = mockJson.mock.calls[0][0];
            expect(response.data[0]['Composite SCORE']).toBe(84.2);
            expect(response.data[1]['Composite SCORE']).toBe(79.5);
            expect(response.filters.weights).toEqual(weights);
        });

        test('should sort by composite score when weights provided and no other sort', async () => {
            const weights = { AR: 50, ER: 50 };
            mockReq.query = { weights: JSON.stringify(weights) };
            validateWeights.mockReturnValue(weights);
            calculateCompositeScore
                .mockReturnValueOnce(84.2) // First university
                .mockReturnValueOnce(79.5); // Second university

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

            await getRankings(mockReq, mockRes);

            const response = mockJson.mock.calls[0][0];
            // Should be sorted by composite score (descending)
            expect(response.data[0]['Composite SCORE']).toBe(84.2);
            expect(response.data[1]['Composite SCORE']).toBe(79.5);
        });

        test('should not sort by composite score when year filter is provided', async () => {
            const weights = { AR: 50, ER: 50 };
            mockReq.query = { year: '2025', weights: JSON.stringify(weights) };
            validateYear.mockReturnValue('2025');
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

            await getRankings(mockReq, mockRes);

            expect(University.find().sort).toHaveBeenCalledWith({ '2025 Rank': 1 });
            // Should not re-sort by composite score
        });

        test('should handle individual weight parameters', async () => {
            mockReq.query = { 
                weight_AR: '30',
                weight_ER: '25',
                weight_FSR: '20',
                weight_CPF: '15',
                weight_IFR: '10'
            };
            const weights = { AR: 30, ER: 25, FSR: 20, CPF: 15, IFR: 10 };
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

            await getRankings(mockReq, mockRes);

            expect(validateWeights).toHaveBeenCalledWith(undefined, mockReq.query);
            expect(calculateCompositeScore).toHaveBeenCalledWith(mockUniversities[0], weights);
            expect(calculateCompositeScore).toHaveBeenCalledWith(mockUniversities[1], weights);
        });

        test('should not calculate composite scores when no weights provided', async () => {
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

            await getRankings(mockReq, mockRes);

            expect(calculateCompositeScore).not.toHaveBeenCalled();
            expect(mockJson).toHaveBeenCalledWith({
                data: mockUniversities,
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 2,
                    itemsPerPage: 10,
                    hasNextPage: false,
                    hasPrevPage: false
                },
                filters: {
                    year: null,
                    region: null,
                    subject: null,
                    weights: null
                }
            });
        });
    });

    describe('Validation Errors', () => {
        test('should handle year validation error', async () => {
            mockReq.query = { year: 'invalid' };
            validateYear.mockImplementation(() => {
                throw new Error('Invalid year. Must be one of: 2025, 2026');
            });

            await getRankings(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Validation failed',
                message: 'Invalid year. Must be one of: 2025, 2026'
            });
        });

        test('should handle region validation error', async () => {
            mockReq.query = { region: 'invalid' };
            validateRegion.mockImplementation(() => {
                throw new Error('Invalid region. Must be one of: Asia, Europe, North America, South America, Africa, Middle East, Oceania');
            });

            await getRankings(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Validation failed',
                message: 'Invalid region. Must be one of: Asia, Europe, North America, South America, Africa, Middle East, Oceania'
            });
        });

        test('should handle subject validation error', async () => {
            mockReq.query = { subject: 'invalid' };
            validateSubject.mockImplementation(() => {
                throw new Error('Invalid subject. Must be one of: AR, ER, FSR, CPF, IFR, ISR, ISD, IRN, EO, SUS, Overall');
            });

            await getRankings(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Validation failed',
                message: 'Invalid subject. Must be one of: AR, ER, FSR, CPF, IFR, ISR, ISD, IRN, EO, SUS, Overall'
            });
        });

        test('should handle pagination validation error', async () => {
            mockReq.query = { page: '-1' };
            validatePagination.mockImplementation(() => {
                throw new Error('Page must be a positive integer');
            });

            await getRankings(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Validation failed',
                message: 'Page must be a positive integer'
            });
        });

        test('should handle weights validation error', async () => {
            mockReq.query = { weights: '{"AR": 30, "ER": 25}' }; // Not 100%
            validateWeights.mockImplementation(() => {
                throw new Error('Total weights must equal 100%');
            });

            await getRankings(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Validation failed',
                message: 'Total weights must equal 100%'
            });
    });
  });

  describe('Error Handling', () => {
        test('should handle database connection errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      University.find.mockImplementation(() => {
        throw dbError;
      });

      await getRankings(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Failed to fetch rankings',
        message: 'Database connection failed'
      });
    });

    test('should handle find query errors', async () => {
            const queryError = new Error('Query execution failed');
      University.find.mockReturnValue({
                sort: jest.fn().mockImplementation(() => {
                    throw queryError;
        })
      });

      await getRankings(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Failed to fetch rankings',
                message: 'Query execution failed'
      });
    });

        test('should handle count query errors', async () => {
            const countError = new Error('Count operation failed');
      University.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue([])
            })
          })
        })
      });
      University.countDocuments.mockRejectedValue(countError);

      await getRankings(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Failed to fetch rankings',
                message: 'Count operation failed'
            });
      });
    });

    describe('Sorting Logic', () => {
        test('should sort by year rank when year is provided', async () => {
            mockReq.query = { year: '2025' };
            validateYear.mockReturnValue('2025');
      
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

      await getRankings(mockReq, mockRes);

            expect(University.find().sort).toHaveBeenCalledWith({ '2025 Rank': 1 });
        });

        test('should sort by subject score when subject is provided but no year', async () => {
            mockReq.query = { subject: 'ER' };
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

      await getRankings(mockReq, mockRes);

            expect(University.find().sort).toHaveBeenCalledWith({ 'ER SCORE': 1 });
        });

        test('should prioritize year rank over subject score when both are provided', async () => {
            mockReq.query = { year: '2026', subject: 'AR' };
            validateYear.mockReturnValue('2026');
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

      await getRankings(mockReq, mockRes);

            expect(University.find().sort).toHaveBeenCalledWith({ '2026 Rank': 1 });
    });
  });
});
