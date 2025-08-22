# Postman Collection Setup Guide

This guide explains how to set up and use the Postman collection for testing the University Rankings API.

## Files Included

- `University_Rankings_API.postman_collection.json` - Main collection with all API endpoints and tests
- `University_Rankings_API.postman_environment.json` - Environment configuration
- `README.md` - This setup guide

## Quick Start

### 1. Import Collection

1. Open Postman
2. Click **Import** button
3. Select the `University_Rankings_API.postman_collection.json` file
4. The collection will be imported with all endpoints and tests

### 2. Import Environment

1. In Postman, go to **Environments** tab
2. Click **Import** button
3. Select the `University_Rankings_API.postman_environment.json` file
4. Select the imported environment from the dropdown

### 3. Start Your Server

Make sure your Node.js server is running:

```bash
cd /path/to/your/backend
npm start
```

The server should be running on `http://localhost:3000`

## Collection Overview

### Endpoints Included

1. **Get All Universities** (`GET /api`)
   - Retrieves all universities without filtering
   - Tests response structure and required fields

2. **Get Rankings** (`GET /api/rankings`)
   - Main endpoint with pagination and filtering
   - Comprehensive tests for response structure

3. **Get Rankings - Year Filter** (`GET /api/rankings?year=2025`)
   - Tests year filtering functionality
   - Validates that returned universities have 2025 rankings

4. **Get Rankings - Region Filter** (`GET /api/rankings?region=Middle East`)
   - Tests region filtering (case-insensitive)
   - Validates region matching

5. **Get Rankings - Combined Filters** (`GET /api/rankings?year=2026&region=Asia&page=1&limit=5`)
   - Tests multiple filters together
   - Validates pagination with filters

6. **Get Rankings - Pagination** (`GET /api/rankings?page=2&limit=10`)
   - Tests pagination functionality
   - Validates pagination metadata

7. **Get Rankings - Empty Result** (`GET /api/rankings?region=NonExistentRegion`)
   - Tests behavior when no results match
   - Validates empty response structure

8. **Get Rankings - Invalid Parameters** (`GET /api/rankings?page=abc&limit=xyz`)
   - Tests error handling for invalid parameters
   - Validates graceful degradation

## Environment Variables

The environment includes the following variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:3000` | Base URL for the API server |
| `api_version` | `v1` | API version |
| `timeout` | `5000` | Request timeout in milliseconds |
| `max_limit` | `100` | Maximum items per page |

### Updating Environment Variables

1. Select the environment from the dropdown
2. Click the **eye** icon to view variables
3. Modify values as needed for your setup

## Running Tests

### Individual Request Tests

1. Select any request from the collection
2. Click **Send**
3. View test results in the **Test Results** tab
4. All tests will run automatically after the request

### Running All Tests

1. Right-click on the collection
2. Select **Run collection**
3. Choose the environment
4. Click **Run University Rankings API**

### Test Results

Each request includes comprehensive tests that validate:

- **Status Codes**: Correct HTTP status codes
- **Response Time**: Performance requirements (< 2000ms)
- **Response Structure**: Proper JSON structure
- **Data Validation**: Required fields and data types
- **Business Logic**: Pagination logic, filter application
- **Error Handling**: Graceful error responses

## Test Categories

### 1. Basic Functionality Tests
- ✅ HTTP status codes (200 for success, 500 for errors)
- ✅ Response time performance
- ✅ JSON response format
- ✅ Content-Type headers

### 2. Data Structure Tests
- ✅ Response object structure
- ✅ Pagination metadata
- ✅ Filter application
- ✅ University object fields

### 3. Business Logic Tests
- ✅ Pagination calculations
- ✅ Filter application logic
- ✅ Empty result handling
- ✅ Invalid parameter handling

### 4. Edge Case Tests
- ✅ Large page numbers
- ✅ Invalid pagination parameters
- ✅ Non-existent regions
- ✅ Special characters in filters

## Customizing Tests

### Adding New Tests

To add custom tests to any request:

1. Select the request
2. Go to the **Tests** tab
3. Add your test code:

```javascript
// Example custom test
pm.test("Custom test name", function () {
    const response = pm.response.json();
    // Your test logic here
    pm.expect(response.data.length).to.be.greaterThan(0);
});
```

### Modifying Existing Tests

1. Open any request
2. Go to the **Tests** tab
3. Modify the existing test code
4. Save the request

### Test Scripts Reference

Common test patterns:

```javascript
// Test status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response time
pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Test JSON response
pm.test("Response is valid JSON", function () {
    pm.response.to.be.json;
});

// Test response structure
pm.test("Response has required fields", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('data');
    pm.expect(response).to.have.property('pagination');
});

// Test array length
pm.test("Data array has items", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.be.an('array');
    pm.expect(response.data.length).to.be.greaterThan(0);
});
```

## Troubleshooting

### Common Issues

1. **Server Not Running**
   - Error: "Could not get any response"
   - Solution: Start your Node.js server on port 3000

2. **Environment Not Selected**
   - Error: "base_url is not defined"
   - Solution: Select the environment from the dropdown

3. **CORS Issues**
   - Error: CORS policy blocking requests
   - Solution: Ensure CORS is properly configured in your server

4. **Database Connection**
   - Error: 500 status with database error message
   - Solution: Check your MongoDB connection and data

### Debug Mode

To enable debug mode:

1. Open Postman settings
2. Go to **General** tab
3. Enable **Show response headers**
4. Enable **Show response size**

### Console Logging

View detailed logs:

1. Open Postman
2. Go to **View** → **Show Postman Console**
3. Run requests to see detailed logs

## Best Practices

### 1. Environment Management
- Use different environments for development, staging, and production
- Never commit sensitive data in environment files
- Use environment variables for dynamic values

### 2. Test Organization
- Group related tests logically
- Use descriptive test names
- Keep tests focused and specific

### 3. Data Validation
- Test both positive and negative scenarios
- Validate edge cases and error conditions
- Test data types and formats

### 4. Performance Testing
- Monitor response times
- Test with different data sizes
- Validate pagination performance

## Integration with CI/CD

### Newman (Command Line)

Run tests from command line:

```bash
# Install Newman
npm install -g newman

# Run collection
newman run University_Rankings_API.postman_collection.json \
  -e University_Rankings_API.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

### GitHub Actions Example

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Start server
        run: npm start &
      - name: Wait for server
        run: sleep 10
      - name: Run API tests
        run: |
          npm install -g newman
          newman run postman/University_Rankings_API.postman_collection.json \
            -e postman/University_Rankings_API.postman_environment.json
```

## Support

For issues with the Postman collection:

1. Check the troubleshooting section above
2. Verify your server is running correctly
3. Check the API documentation for endpoint details
4. Review the test logs in Postman console

## Contributing

To contribute to the Postman collection:

1. Add new endpoints as needed
2. Include comprehensive tests for each endpoint
3. Update this README with new information
4. Test thoroughly before submitting changes
