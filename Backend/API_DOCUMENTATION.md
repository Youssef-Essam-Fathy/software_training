# University Rankings API Documentation

## Overview

The University Rankings API provides access to university ranking data with advanced filtering and pagination capabilities. This RESTful API allows you to retrieve university information, filter by various criteria, and navigate through large datasets efficiently.

## Base URL

```
Development: http://localhost:3000
Production: https://your-production-domain.com
```

## Authentication

Currently, this API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses are returned in JSON format with the following structure:

### Success Response
```json
{
  "data": [...],           // Array of universities
  "pagination": {          // Pagination metadata (for rankings endpoint)
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {             // Applied filters (for rankings endpoint)
    "year": "2025",
    "region": "Middle East"
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Endpoints

### 1. Get All Universities

Retrieve all universities without any filtering or pagination.

**Endpoint:** `GET /api`

**Description:** Returns the complete list of universities in the database.

**Parameters:** None

**Response:**
```json
[
  {
    "Index": 1,
    "2026 Rank": 1,
    "2025 Rank": 2,
    "Name": "University Name",
    "Country": "Country Name",
    "Region": "Region Name",
    "Size": "Large",
    "Focus": "Comprehensive",
    "Research": "Very High",
    "Status": "Public",
    "AR SCORE": 95.5,
    "AR RANK": 1,
    "ER SCORE": 90.0,
    "ER RANK": 2,
    "FSR SCORE": 88.5,
    "FSR RANK": 3,
    "CPF SCORE": 92.0,
    "CPF RANK": 1,
    "IFR SCORE": 87.0,
    "IFR RANK": 4,
    "ISR SCORE": 89.5,
    "ISR RANK": 2,
    "ISD SCORE": 91.0,
    "ISD RANK": 1,
    "IRN SCORE": 86.5,
    "IRN RANK": 5,
    "EO SCORE": 93.0,
    "EO RANK": 1,
    "SUS SCORE": 94.5,
    "SUS RANK": 1,
    "Overall SCORE": 90.5
  }
]
```

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api" \
  -H "Content-Type: application/json"
```

---

### 2. Get Rankings

Retrieve university rankings with optional filtering and pagination.

**Endpoint:** `GET /api/rankings`

**Description:** Main endpoint for retrieving university rankings with advanced filtering capabilities.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `year` | string | No | - | Filter by specific year ranking (e.g., "2025", "2026") |
| `region` | string | No | - | Filter by region (case-insensitive, supports partial matching) |
| `page` | number | No | 1 | Page number for pagination (starts from 1) |
| `limit` | number | No | 10 | Number of items per page (max: 100) |

**Response Structure:**
```json
{
  "data": [
    {
      "Index": 1,
      "2026 Rank": 1,
      "2025 Rank": 2,
      "Name": "University Name",
      "Country": "Country Name",
      "Region": "Region Name",
      "Size": "Large",
      "Focus": "Comprehensive",
      "Research": "Very High",
      "Status": "Public",
      "AR SCORE": 95.5,
      "AR RANK": 1,
      "ER SCORE": 90.0,
      "ER RANK": 2,
      "FSR SCORE": 88.5,
      "FSR RANK": 3,
      "CPF SCORE": 92.0,
      "CPF RANK": 1,
      "IFR SCORE": 87.0,
      "IFR RANK": 4,
      "ISR SCORE": 89.5,
      "ISR RANK": 2,
      "ISD SCORE": 91.0,
      "ISD RANK": 1,
      "IRN SCORE": 86.5,
      "IRN RANK": 5,
      "EO SCORE": 93.0,
      "EO RANK": 1,
      "SUS SCORE": 94.5,
      "SUS RANK": 1,
      "Overall SCORE": 90.5
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {
    "year": "2025",
    "region": "Middle East"
  }
}
```

## Usage Examples

### Basic Usage

**Get first page of all rankings:**
```bash
curl -X GET "http://localhost:3000/api/rankings"
```

**Get 2025 rankings:**
```bash
curl -X GET "http://localhost:3000/api/rankings?year=2025"
```

**Get universities from Middle East region:**
```bash
curl -X GET "http://localhost:3000/api/rankings?region=Middle%20East"
```

### Advanced Filtering

**Get 2026 rankings for Asia region:**
```bash
curl -X GET "http://localhost:3000/api/rankings?year=2026&region=Asia"
```

**Get second page with 20 items per page:**
```bash
curl -X GET "http://localhost:3000/api/rankings?page=2&limit=20"
```

**Combined filters with pagination:**
```bash
curl -X GET "http://localhost:3000/api/rankings?year=2025&region=Europe&page=1&limit=5"
```

### JavaScript Examples

**Using Fetch API:**
```javascript
// Get all rankings
fetch('http://localhost:3000/api/rankings')
  .then(response => response.json())
  .then(data => {
    console.log('Universities:', data.data);
    console.log('Pagination:', data.pagination);
    console.log('Filters:', data.filters);
  });

// Get filtered rankings
fetch('http://localhost:3000/api/rankings?year=2025&region=Middle%20East&page=1&limit=10')
  .then(response => response.json())
  .then(data => {
    data.data.forEach(university => {
      console.log(`${university.Name} - Rank: ${university['2025 Rank']}`);
    });
  });
```

**Using Axios:**
```javascript
import axios from 'axios';

// Get rankings with filters
const getRankings = async (year, region, page = 1, limit = 10) => {
  try {
    const response = await axios.get('http://localhost:3000/api/rankings', {
      params: { year, region, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rankings:', error);
  }
};

// Usage
const rankings = await getRankings('2025', 'Middle East', 1, 20);
```

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success - Data retrieved successfully |
| 500 | Internal Server Error - Database or server error |

### Error Response Examples

**Database Connection Error:**
```json
{
  "error": "Failed to fetch rankings",
  "message": "Database connection failed"
}
```

**Query Execution Error:**
```json
{
  "error": "Failed to fetch rankings",
  "message": "Query execution failed"
}
```

## Data Schema

### University Object

| Field | Type | Description |
|-------|------|-------------|
| `Index` | number | Unique identifier |
| `2026 Rank` | number | 2026 ranking position |
| `2025 Rank` | number | 2025 ranking position |
| `Name` | string | University name |
| `Country` | string | Country name |
| `Region` | string | Geographic region |
| `Size` | string | University size (Small, Medium, Large) |
| `Focus` | string | University focus (Comprehensive, Specialist) |
| `Research` | string | Research intensity (Very High, High, Medium, Low) |
| `Status` | string | University status (Public, Private) |
| `AR SCORE` | number | Academic Reputation score |
| `AR RANK` | number/mixed | Academic Reputation rank |
| `ER SCORE` | number | Employer Reputation score |
| `ER RANK` | number/mixed | Employer Reputation rank |
| `FSR SCORE` | number | Faculty Student Ratio score |
| `FSR RANK` | number/mixed | Faculty Student Ratio rank |
| `CPF SCORE` | number | Citations per Faculty score |
| `CPF RANK` | number/mixed | Citations per Faculty rank |
| `IFR SCORE` | number | International Faculty Ratio score |
| `IFR RANK` | number/mixed | International Faculty Ratio rank |
| `ISR SCORE` | number | International Student Ratio score |
| `ISR RANK` | number/mixed | International Student Ratio rank |
| `ISD SCORE` | number | International Research Network score |
| `ISD RANK` | number/mixed | International Research Network rank |
| `IRN SCORE` | number | Industry Research Network score |
| `IRN RANK` | number/mixed | Industry Research Network rank |
| `EO SCORE` | number | Employment Outcomes score |
| `EO RANK` | number/mixed | Employment Outcomes rank |
| `SUS SCORE` | number | Sustainability score |
| `SUS RANK` | number/mixed | Sustainability rank |
| `Overall SCORE` | number | Overall university score |

### Pagination Object

| Field | Type | Description |
|-------|------|-------------|
| `currentPage` | number | Current page number |
| `totalPages` | number | Total number of pages |
| `totalItems` | number | Total number of items |
| `itemsPerPage` | number | Number of items per page |
| `hasNextPage` | boolean | Whether there's a next page |
| `hasPrevPage` | boolean | Whether there's a previous page |

### Filters Object

| Field | Type | Description |
|-------|------|-------------|
| `year` | string/null | Applied year filter |
| `region` | string/null | Applied region filter |

## Rate Limiting

Currently, there are no rate limits implemented. However, it's recommended to:

- Make reasonable requests (not more than 100 requests per minute)
- Use pagination for large datasets
- Cache responses when appropriate

## Best Practices

### 1. Pagination
- Always use pagination for large datasets
- Start with page 1 and limit of 10-20 items
- Use `hasNextPage` and `hasPrevPage` for navigation

### 2. Filtering
- Use specific year filters when you need rankings for a particular year
- Use region filters to narrow down results geographically
- Combine filters for more precise results

### 3. Error Handling
- Always check for error responses
- Implement retry logic for 500 errors
- Handle empty result sets gracefully

### 4. Performance
- Use appropriate `limit` values (10-50 is usually optimal)
- Cache frequently requested data
- Consider using the `/api` endpoint for complete datasets

## Testing

### Postman Collection

A comprehensive Postman collection is available at:
```
postman/University_Rankings_API.postman_collection.json
```

### Test Scenarios

1. **Basic Functionality**
   - Get all universities
   - Get rankings with default pagination

2. **Filtering**
   - Year filter (2025, 2026)
   - Region filter (case-insensitive)
   - Combined filters

3. **Pagination**
   - Different page numbers
   - Different limit values
   - Edge cases (first/last page)

4. **Error Handling**
   - Invalid parameters
   - Empty result sets
   - Server errors

## Support

For API support and questions:

- **Documentation:** This file
- **Postman Collection:** `postman/University_Rankings_API.postman_collection.json`
- **Environment:** `postman/University_Rankings_API.postman_environment.json`

## Version History

- **v1.0.0** - Initial release with basic ranking functionality
- **v1.1.0** - Added comprehensive filtering and pagination
- **v1.2.0** - Enhanced error handling and response structure
