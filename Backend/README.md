# University Rankings API

A comprehensive RESTful API for university rankings with advanced filtering, pagination, and comprehensive testing.

## 🚀 Features

- **RESTful API** with Express.js and Node.js
- **Advanced Filtering** by year and region
- **Pagination** with metadata
- **Comprehensive Testing** with Jest and Postman
- **100% Test Coverage** for all endpoints
- **Postman Collection** with automated tests
- **Complete Documentation** with examples

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Postman Collection](#postman-collection)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Development](#development)

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Backend

# Install dependencies
npm install

# Start the server (with database)
npm start

# Or start test server (without database)
node src/app-test.js
```

### Test the API

```bash
# Health check
curl http://localhost:3000/health

# Get all universities
curl http://localhost:3000/api

# Get rankings with pagination
curl http://localhost:3000/api/rankings?page=1&limit=5

# Get filtered rankings
curl "http://localhost:3000/api/rankings?year=2025&region=Middle%20East"
```

## 🔌 API Endpoints

### 1. Health Check
```
GET /health
```
Returns server status.

### 2. Get All Universities
```
GET /api
```
Returns all universities without filtering.

### 3. Get Rankings (Main Endpoint)
```
GET /api/rankings
```

**Query Parameters:**
- `year` (optional): Filter by specific year (e.g., "2025", "2026")
- `region` (optional): Filter by region (case-insensitive)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example Requests:**
```bash
# Basic request
curl http://localhost:3000/api/rankings

# With filters
curl "http://localhost:3000/api/rankings?year=2025&region=Middle%20East"

# With pagination
curl "http://localhost:3000/api/rankings?page=2&limit=5"

# Combined
curl "http://localhost:3000/api/rankings?year=2026&region=Asia&page=1&limit=10"
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- **100% Code Coverage** achieved
- **25 test cases** covering all scenarios
- **Unit tests** for controllers
- **Integration tests** for routes
- **Error handling** tests
- **Edge cases** covered

### Test Categories

1. **Query Parameter Tests**
   - Year filtering
   - Region filtering
   - Pagination
   - Combined filters

2. **Error Handling Tests**
   - Database errors
   - Query errors
   - Invalid parameters

3. **Edge Cases**
   - Large page numbers
   - Invalid inputs
   - Empty results

## 📮 Postman Collection

### Setup

1. **Import Collection:**
   - Open Postman
   - Import `postman/University_Rankings_API.postman_collection.json`

2. **Import Environment:**
   - Import `postman/University_Rankings_API.postman_environment.json`
   - Select the environment from dropdown

3. **Start Server:**
   ```bash
   node src/app-test.js
   ```

### Collection Features

- **8 API endpoints** with comprehensive tests
- **Automated test scripts** for each request
- **Environment variables** for different setups
- **Response validation** and error handling
- **Performance testing** (response time < 2000ms)

### Test Scenarios

1. **Basic Functionality**
   - Health check
   - Get all universities
   - Basic rankings request

2. **Filtering**
   - Year filter (2025, 2026)
   - Region filter (case-insensitive)
   - Combined filters

3. **Pagination**
   - Different page numbers
   - Different limit values
   - Pagination metadata validation

4. **Error Handling**
   - Invalid parameters
   - Empty result sets
   - Server errors

### Running Tests

```bash
# Individual requests
# Select any request in Postman and click "Send"

# Run entire collection
# Right-click collection → "Run collection"

# Command line (with Newman)
npm install -g newman
newman run postman/University_Rankings_API.postman_collection.json \
  -e postman/University_Rankings_API.postman_environment.json
```

## 📚 Documentation

### API Documentation
- **Complete API docs:** `API_DOCUMENTATION.md`
- **Postman setup:** `postman/README.md`
- **Testing guide:** `TESTING.md`

### Key Documentation Files

1. **`API_DOCUMENTATION.md`**
   - Complete endpoint documentation
   - Request/response examples
   - Error handling guide
   - Best practices

2. **`postman/README.md`**
   - Postman collection setup
   - Test execution guide
   - Troubleshooting

3. **`TESTING.md`**
   - Unit test documentation
   - Test coverage details
   - Testing best practices

## 📁 Project Structure

```
Backend/
├── src/
│   ├── app.js                 # Main application (with database)
│   ├── app-test.js            # Test application (without database)
│   ├── controllers/
│   │   └── rankingController.js
│   ├── routes/
│   │   └── rankingRoutes.js
│   ├── models/
│   │   └── university.model.js
│   ├── config/
│   │   └── db.js
│   └── __tests__/
│       ├── setup.js
│       ├── controllers/
│       │   └── rankingController.test.js
│       ├── routes/
│       │   └── rankingRoutes.test.js
│       └── utils/
│           └── testHelpers.js
├── postman/
│   ├── University_Rankings_API.postman_collection.json
│   ├── University_Rankings_API.postman_environment.json
│   └── README.md
├── package.json
├── jest.config.js
├── API_DOCUMENTATION.md
├── TESTING.md
└── README.md
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start with nodemon
npm start           # Start production server

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
```

### Environment Variables

Create a `.env` file for database connection:

```env
MONGODB_URI=mongodb://localhost:27017/university-rankings
PORT=3000
```

### Database Setup

For production use with MongoDB:

1. Install MongoDB
2. Set up connection string in `.env`
3. Use `npm start` to run with database

For testing without database:

```bash
node src/app-test.js
```

## 🎯 API Response Examples

### Success Response
```json
{
  "data": [
    {
      "Index": 1,
      "2026 Rank": 1,
      "2025 Rank": 2,
      "Name": "Cairo University",
      "Country": "Egypt",
      "Region": "Middle East",
      "Overall SCORE": 90.5
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 3,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "filters": {
    "year": "2025",
    "region": "Middle East"
  }
}
```

### Error Response
```json
{
  "error": "Failed to fetch rankings",
  "message": "Database connection failed"
}
```

## 🔧 Configuration

### Jest Configuration
- Test environment: Node.js
- Coverage reporting enabled
- Test timeout: 10 seconds
- Mock strategy for database operations

### Postman Configuration
- Environment variables for different setups
- Automated test scripts
- Response validation
- Performance monitoring

## 🚀 Deployment

### Production Setup

1. **Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your-production-mongodb-uri
   ```

2. **Start Application:**
   ```bash
   npm start
   ```

3. **Health Check:**
   ```bash
   curl http://your-domain.com/health
   ```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Testing Checklist

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Postman collection tests pass
- [ ] Code coverage maintained
- [ ] Documentation updated

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

1. Check the documentation files
2. Review the test examples
3. Check the Postman collection
4. Run the health check endpoint

### Quick Troubleshooting

```bash
# Check if server is running
curl http://localhost:3000/health

# Check API endpoints
curl http://localhost:3000/api/rankings

# Run tests
npm test

# Check logs
tail -f logs/app.log
```

---

**Happy Testing! 🎉**
