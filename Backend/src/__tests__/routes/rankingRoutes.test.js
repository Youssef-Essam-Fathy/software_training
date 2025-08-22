const request = require('supertest');
const express = require('express');
const rankingRoutes = require('../../routes/rankingRoutes');
const University = require('../../models/university.model');

// Mock the University model
jest.mock('../../models/university.model');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api', rankingRoutes);

describe('Ranking Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/rankings', () => {
    test('should return 200 and universities with default pagination', async () => {
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

      expect(response.body).toEqual({
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

    test('should handle year filter', async () => {
      const mockUniversities = [
        { Name: 'University A', '2025 Rank': 1 }
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
        .get('/api/rankings?year=2025')
        .expect(200);

      expect(University.find).toHaveBeenCalledWith({
        '2025 Rank': { $exists: true, $ne: null }
      });
      expect(response.body.filters.year).toBe('2025');
    });

    test('should handle region filter', async () => {
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

    test('should handle pagination parameters', async () => {
      const mockUniversities = [
        { Name: 'University F', 'Overall SCORE': 85 }
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

      University.countDocuments.mockResolvedValue(25);

      const response = await request(app)
        .get('/api/rankings?page=2&limit=10')
        .expect(200);

      expect(University.find().sort().skip).toHaveBeenCalledWith(10);
      expect(University.find().sort().skip().limit).toHaveBeenCalledWith(10);
      expect(response.body.pagination).toEqual({
        currentPage: 2,
        totalPages: 3,
        totalItems: 25,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPrevPage: true
      });
    });

    test('should handle combined filters', async () => {
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

      const response = await request(app)
        .get('/api/rankings?year=2026&region=Asia&page=1&limit=5')
        .expect(200);

      expect(University.find).toHaveBeenCalledWith({
        '2026 Rank': { $exists: true, $ne: null },
        Region: { $regex: new RegExp('Asia', 'i') }
      });
      expect(response.body.filters).toEqual({
        year: '2026',
        region: 'Asia'
      });
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

    test('should handle query execution errors', async () => {
      const queryError = new Error('Query execution failed');
      University.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              select: jest.fn().mockRejectedValue(queryError)
            })
          })
        })
      });

      const response = await request(app)
        .get('/api/rankings')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to fetch rankings',
        message: 'Query execution failed'
      });
    });

    test('should handle empty result set', async () => {
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
        .get('/api/rankings?region=NonExistent')
        .expect(200);

      expect(response.body).toEqual({
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
          region: 'NonExistent'
        }
      });
    });

    test('should handle invalid pagination parameters', async () => {
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

      const response = await request(app)
        .get('/api/rankings?page=abc&limit=xyz')
        .expect(200);

      // Should handle NaN values gracefully
      expect(University.find().sort().skip).toHaveBeenCalledWith(NaN);
      expect(University.find().sort().skip().limit).toHaveBeenCalledWith(NaN);
    });

    test('should handle special characters in region filter', async () => {
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

      const response = await request(app)
        .get('/api/rankings?region=North%20America%20%26%20Europe')
        .expect(200);

      expect(University.find).toHaveBeenCalledWith({
        Region: { $regex: new RegExp('North America & Europe', 'i') }
      });
    });

    test('should handle case insensitive region search', async () => {
      const mockUniversities = [
        { Name: 'University A', Region: 'MIDDLE EAST' }
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
        .get('/api/rankings?region=middle%20east')
        .expect(200);

      expect(University.find).toHaveBeenCalledWith({
        Region: { $regex: new RegExp('middle east', 'i') }
      });
      expect(response.body.data).toHaveLength(1);
    });
  });
});
