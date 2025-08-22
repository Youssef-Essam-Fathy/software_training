const { getRankings } = require('../../controllers/rankingController');
const University = require('../../models/university.model');

// Mock the University model
jest.mock('../../models/university.model');

describe('Ranking Controller', () => {
  let mockReq;
  let mockRes;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup mock response
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      json: mockJson,
      status: mockStatus
    };
    
    // Setup default mock request
    mockReq = {
      query: {}
    };
  });

  describe('Query Parameters', () => {
    test('should handle request with no query parameters', async () => {
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
      expect(University.find().sort().skip).toHaveBeenCalledWith(0);
      expect(University.find().sort().skip().limit).toHaveBeenCalledWith(10);
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
          region: null
        }
      });
    });

    test('should handle year filter parameter', async () => {
      mockReq.query = { year: '2025' };
      
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
          region: null
        }
      });
    });

    test('should handle region filter parameter', async () => {
      mockReq.query = { region: 'Middle East' };
      
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
          region: 'Middle East'
        }
      });
    });

    test('should handle both year and region filters', async () => {
      mockReq.query = { year: '2026', region: 'Asia' };
      
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
      expect(University.find().sort).toHaveBeenCalledWith({ '2026 Rank': 1 });
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
          region: 'Asia'
        }
      });
    });

    test('should handle pagination parameters', async () => {
      mockReq.query = { page: '2', limit: '5' };
      
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
      
      University.countDocuments.mockResolvedValue(12);

      await getRankings(mockReq, mockRes);

      expect(University.find().sort().skip).toHaveBeenCalledWith(5); // (2-1) * 5
      expect(University.find().sort().skip().limit).toHaveBeenCalledWith(5);
      expect(mockJson).toHaveBeenCalledWith({
        data: mockUniversities,
        pagination: {
          currentPage: 2,
          totalPages: 3, // Math.ceil(12/5)
          totalItems: 12,
          itemsPerPage: 5,
          hasNextPage: true,
          hasPrevPage: true
        },
        filters: {
          year: null,
          region: null
        }
      });
    });

    test('should handle string pagination parameters', async () => {
      mockReq.query = { page: 'abc', limit: 'xyz' };
      
      const mockUniversities = [];
      
      University.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue(mockUniversities)
            })
          })
        })
      });
      
      University.countDocuments.mockResolvedValue(0);

      await getRankings(mockReq, mockRes);

      // Should handle NaN values gracefully
      expect(University.find().sort().skip).toHaveBeenCalledWith(NaN);
      expect(University.find().sort().skip().limit).toHaveBeenCalledWith(NaN);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors', async () => {
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
      const findError = new Error('Find query failed');
      University.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockRejectedValue(findError)
            })
          })
        })
      });

      await getRankings(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Failed to fetch rankings',
        message: 'Find query failed'
      });
    });

    test('should handle countDocuments errors', async () => {
      const countError = new Error('Count query failed');
      
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
        message: 'Count query failed'
      });
    });

    test('should handle invalid year format', async () => {
      mockReq.query = { year: 'invalid-year' };
      
      const mockUniversities = [];
      
      University.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue(mockUniversities)
            })
          })
        })
      });
      
      University.countDocuments.mockResolvedValue(0);

      await getRankings(mockReq, mockRes);

      // Should still work with invalid year format
      expect(University.find).toHaveBeenCalledWith({
        'invalid-year Rank': { $exists: true, $ne: null }
      });
    });

    test('should handle empty result set', async () => {
      mockReq.query = { region: 'NonExistentRegion' };
      
      const mockUniversities = [];
      
      University.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue(mockUniversities)
            })
          })
        })
      });
      
      University.countDocuments.mockResolvedValue(0);

      await getRankings(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        },
        filters: {
          year: null,
          region: 'NonExistentRegion'
        }
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle very large page numbers', async () => {
      mockReq.query = { page: '999999' };
      
      const mockUniversities = [];
      
      University.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue(mockUniversities)
            })
          })
        })
      });
      
      University.countDocuments.mockResolvedValue(100);

      await getRankings(mockReq, mockRes);

      expect(University.find().sort().skip).toHaveBeenCalledWith(9999980); // (999999-1) * 10
    });

    test('should handle zero limit', async () => {
      mockReq.query = { limit: '0' };
      
      const mockUniversities = [];
      
      University.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue(mockUniversities)
            })
          })
        })
      });
      
      University.countDocuments.mockResolvedValue(100);

      await getRankings(mockReq, mockRes);

      expect(University.find().sort().skip().limit).toHaveBeenCalledWith(0);
    });

    test('should handle negative page numbers', async () => {
      mockReq.query = { page: '-1' };
      
      const mockUniversities = [];
      
      University.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue(mockUniversities)
            })
          })
        })
      });
      
      University.countDocuments.mockResolvedValue(100);

      await getRankings(mockReq, mockRes);

      expect(University.find().sort().skip).toHaveBeenCalledWith(-20); // (-1-1) * 10
    });
  });
});
