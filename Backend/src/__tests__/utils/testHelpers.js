/**
 * Test utility functions for ranking tests
 */

// Mock university data generator
const generateMockUniversity = (overrides = {}) => {
  return {
    Index: 1,
    '2026 Rank': 1,
    '2025 Rank': 2,
    Name: 'Test University',
    Country: 'Test Country',
    Region: 'Test Region',
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
    'Overall SCORE': 90.5,
    ...overrides
  };
};

// Generate multiple mock universities
const generateMockUniversities = (count = 10, overrides = {}) => {
  return Array.from({ length: count }, (_, index) => 
    generateMockUniversity({
      Index: index + 1,
      Name: `University ${index + 1}`,
      'Overall SCORE': 100 - index,
      ...overrides
    })
  );
};

// Mock response object generator
const createMockResponse = () => {
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  
  return {
    json: mockJson,
    status: mockStatus
  };
};

// Mock request object generator
const createMockRequest = (query = {}) => {
  return {
    query,
    params: {},
    body: {}
  };
};

// Mock MongoDB query chain
const createMockQueryChain = (data) => {
  return {
    sort: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(data)
        })
      })
    })
  };
};

// Validation helpers
const validatePaginationResponse = (response, expectedPage, expectedLimit, expectedTotal) => {
  const totalPages = Math.ceil(expectedTotal / expectedLimit);
  
  expect(response.pagination).toEqual({
    currentPage: expectedPage,
    totalPages,
    totalItems: expectedTotal,
    itemsPerPage: expectedLimit,
    hasNextPage: expectedPage < totalPages,
    hasPrevPage: expectedPage > 1
  });
};

const validateFiltersResponse = (response, expectedYear, expectedRegion) => {
  expect(response.filters).toEqual({
    year: expectedYear,
    region: expectedRegion
  });
};

// Error response validator
const validateErrorResponse = (response, expectedError, expectedMessage) => {
  expect(response.error).toBe(expectedError);
  if (expectedMessage) {
    expect(response.message).toBe(expectedMessage);
  }
};

module.exports = {
  generateMockUniversity,
  generateMockUniversities,
  createMockResponse,
  createMockRequest,
  createMockQueryChain,
  validatePaginationResponse,
  validateFiltersResponse,
  validateErrorResponse
};
