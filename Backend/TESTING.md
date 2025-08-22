# Testing Documentation

This document describes the comprehensive test suite for the University Rankings API.

## Test Structure

```
src/__tests__/
├── setup.js                    # Jest configuration and setup
├── controllers/
│   └── rankingController.test.js  # Unit tests for ranking controller
├── routes/
│   └── rankingRoutes.test.js      # Integration tests for ranking routes
└── utils/
    └── testHelpers.js             # Test utility functions
```

## Test Coverage

### 100% Code Coverage Achieved ✅

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Individual Test Files

```bash
# Run only controller tests
npm test -- src/__tests__/controllers/rankingController.test.js

# Run only route tests
npm test -- src/__tests__/routes/rankingRoutes.test.js
```

## Test Categories

### 1. Unit Tests (`rankingController.test.js`)

Tests the `getRankings` controller function in isolation with mocked dependencies.

#### Query Parameter Tests
- ✅ **No parameters**: Default behavior with pagination
- ✅ **Year filter**: Filtering by specific year rankings (2025, 2026)
- ✅ **Region filter**: Case-insensitive region search
- ✅ **Combined filters**: Year and region filters together
- ✅ **Pagination**: Page and limit parameters
- ✅ **Invalid pagination**: String values that become NaN

#### Error Handling Tests
- ✅ **Database connection errors**: Graceful handling of connection failures
- ✅ **Find query errors**: Error handling for data retrieval failures
- ✅ **Count query errors**: Error handling for count operation failures
- ✅ **Invalid year format**: Handling malformed year parameters
- ✅ **Empty result sets**: Proper response for no matching data

#### Edge Cases
- ✅ **Large page numbers**: Handling very high page values
- ✅ **Zero limit**: Edge case with limit of 0
- ✅ **Negative page numbers**: Handling negative pagination values

### 2. Integration Tests (`rankingRoutes.test.js`)

Tests the complete API endpoint using supertest with mocked database.

#### API Endpoint Tests
- ✅ **GET /api/rankings**: Basic endpoint functionality
- ✅ **Query parameter parsing**: URL parameter handling
- ✅ **Response format validation**: Correct JSON structure
- ✅ **HTTP status codes**: Proper status code responses
- ✅ **Error responses**: 500 status for server errors

#### Real-world Scenarios
- ✅ **URL encoding**: Special characters in region names
- ✅ **Case sensitivity**: Region search case insensitivity
- ✅ **Combined parameters**: Multiple filters and pagination
- ✅ **Empty responses**: No data scenarios

## Test Utilities

### `testHelpers.js`

Provides reusable functions for test setup:

```javascript
// Generate mock university data
const university = generateMockUniversity({
  Name: 'Custom University',
  'Overall SCORE': 95
});

// Generate multiple universities
const universities = generateMockUniversities(10);

// Create mock request/response objects
const req = createMockRequest({ year: '2025', page: '1' });
const res = createMockResponse();

// Create mock MongoDB query chain
const queryChain = createMockQueryChain(mockData);

// Validation helpers
validatePaginationResponse(response, 1, 10, 100);
validateFiltersResponse(response, '2025', 'Middle East');
validateErrorResponse(response, 'Failed to fetch rankings');
```

## Mock Strategy

### Database Mocking
- **University Model**: Fully mocked to avoid database dependencies
- **Query Chains**: Mocked MongoDB query methods (find, sort, skip, limit, select)
- **Count Operations**: Mocked countDocuments for pagination

### Request/Response Mocking
- **Express Request**: Mocked with query parameters
- **Express Response**: Mocked with jest functions for assertions

## Test Data

### Sample University Structure
```javascript
{
  Index: 1,
  '2026 Rank': 1,
  '2025 Rank': 2,
  Name: 'Test University',
  Country: 'Test Country',
  Region: 'Test Region',
  'Overall SCORE': 90.5,
  // ... other fields
}
```

## Assertions

### Response Structure Validation
```javascript
expect(response.body).toEqual({
  data: [...],           // Array of universities
  pagination: {          // Pagination metadata
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false
  },
  filters: {             // Applied filters
    year: '2025',
    region: 'Middle East'
  }
});
```

### Error Response Validation
```javascript
expect(response.status).toBe(500);
expect(response.body).toEqual({
  error: 'Failed to fetch rankings',
  message: 'Database connection failed'
});
```

## Best Practices

### Test Organization
- **Describe blocks**: Group related tests logically
- **Clear test names**: Descriptive test case names
- **Setup/teardown**: Proper beforeEach/afterEach hooks
- **Mock cleanup**: Clear mocks between tests

### Assertions
- **Specific assertions**: Test exact values, not just truthiness
- **Error scenarios**: Always test error handling
- **Edge cases**: Test boundary conditions
- **Response format**: Validate complete response structure

### Mock Management
- **Isolated mocks**: Each test has its own mock setup
- **Realistic data**: Mock data reflects real data structure
- **Error simulation**: Mock both success and failure scenarios

## Continuous Integration

The test suite is designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    cd Backend
    npm install
    npm test
    npm run test:coverage
```

## Debugging Tests

### Common Issues
1. **Mock not reset**: Use `jest.clearAllMocks()` in beforeEach
2. **Async/await**: Ensure proper async test functions
3. **Mock chain**: Verify mock chain setup matches actual usage

### Debug Commands
```bash
# Run single test with verbose output
npm test -- --verbose --testNamePattern="should handle year filter"

# Run tests with console output
npm test -- --verbose --silent=false
```

## Performance

- **Test execution time**: ~2-3 seconds for full suite
- **Memory usage**: Minimal due to mocking strategy
- **Parallel execution**: Tests run in parallel where possible

## Future Enhancements

- **E2E tests**: Full application testing with real database
- **Performance tests**: Load testing for pagination
- **Security tests**: Input validation and sanitization
- **API documentation tests**: OpenAPI/Swagger validation
