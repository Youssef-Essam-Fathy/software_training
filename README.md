# University Rankings Egypt - Fullstack Development Team

## 🚀 Project Overview

**Your Best Universities** is a comprehensive web application that ranks and displays universities in Egypt based on QS World University Rankings data. Our team consists of 3 passionate developers working collaboratively to deliver a high-quality, production-ready application that helps students and researchers find the best universities in Egypt.

### 👥 Team Structure
- **2 Backend Developers** - API development, database design, server architecture
- **1 Frontend Developer** - User interface, user experience, client-side functionality

## 🎯 Mission

Our mission is to develop a market-ready university ranking application that demonstrates real-world problem-solving capabilities, modern development practices, and scalable architecture. We focus on creating a user-friendly platform that showcases Egyptian universities' performance metrics and helps users make informed decisions about their education.

## 🛠️ Tech Stack

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (planned)
- **Testing**: Jest (planned)
- **Documentation**: Swagger/OpenAPI (planned)

### Frontend Technologies
- **Framework**: React.js (planned)
- **Styling**: CSS3, Tailwind CSS (planned)
- **State Management**: Context API or Redux (planned)
- **Build Tools**: Vite or Create React App (planned)
- **Testing**: Jest, React Testing Library (planned)

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Code Quality**: ESLint, Prettier
- **Development**: Nodemon for hot reloading
- **Environment**: dotenv for configuration
- **Communication**: Slack, Discord, or Microsoft Teams

## 🗄️ Database Schema

### ✅ MongoDB Schema Implementation

The application uses MongoDB with a collection named `egypt` containing university ranking data.

#### 📦 Collection: egypt

#### 🧱 Mongoose Schema (Current Implementation):

```javascript
const universitySchema = new mongoose.Schema({
  Index: Number,
  '2026 Rank': Number,
  '2025 Rank': Number,
  Name: String,
  Country: String,
  Region: String,
  Size: String,
  Focus: String,
  Research: String,
  Status: String,
  'AR SCORE': Number,
  'AR RANK': mongoose.Schema.Types.Mixed,
  'ER SCORE': Number,
  'ER RANK': mongoose.Schema.Types.Mixed,
  'FSR SCORE': Number,
  'FSR RANK': mongoose.Schema.Types.Mixed,
  'CPF SCORE': Number,
  'CPF RANK': mongoose.Schema.Types.Mixed,
  'IFR SCORE': Number,
  'IFR RANK': mongoose.Schema.Types.Mixed,
  'ISR SCORE': Number,
  'ISR RANK': mongoose.Schema.Types.Mixed,
  'ISD SCORE': Number,
  'ISD RANK': mongoose.Schema.Types.Mixed,
  'IRN SCORE': Number,
  'IRN RANK': mongoose.Schema.Types.Mixed,
  'EO SCORE': Number,
  'EO RANK': mongoose.Schema.Types.Mixed,
  'SUS SCORE': Number,
  'SUS RANK': mongoose.Schema.Types.Mixed,
  'Overall SCORE': Number,
});
```

**Note:** Mixed types are used for rank fields as they may contain numbers or strings like "801+" or "669=".

### 🧑‍🏫 Performance Metrics Explanation

#### Basic Information
| Field | Meaning | Example Value |
|-------|---------|---------------|
| Index | Row index from the original dataset | 381 |
| 2026 Rank | QS global rank in 2026 | 381 |
| 2025 Rank | QS global rank in 2025 | 410 |
| Name | University name | The American University in Cairo |
| Country | Country | Egypt |
| Region | Geographical region | Africa |
| Size | University size (e.g., S, M, L) | M |
| Focus | University academic focus type (e.g., CO = Comprehensive) | CO |
| Research | Research output level (e.g., VH = Very High) | VH |
| Status | Ownership (e.g., Public, Private, Not for Profit) | Private not for Profit |

#### 📊 Performance Metrics
| Code | Description | Example Score | Example Rank |
|------|-------------|---------------|--------------|
| AR | Academic Reputation | 40.8 | 292 |
| ER | Employer Reputation | 46.9 | 278 |
| FSR | Faculty/Student Ratio | 39 | 521 |
| CPF | Citations per Faculty | 12.2 | 801+ |
| IFR | International Faculty Ratio | 98 | 141 |
| ISR | International Student Ratio | 7.1 | 801+ |
| ISD | International Research Diversity | 11.7 | 801+ |
| IRN | International Research Network | 46.8 | 801+ |
| EO | Employment Outcomes | 88.6 | 118 |
| SUS | Sustainability | 51.6 | 669= |
| Overall SCORE | Final composite score | 39.4 | — |

### 📥 Data Import Instructions

To load the data from `qs_cleaned.csv` into MongoDB, use the following command:

```bash
mongoimport --uri="mongodb://localhost:27017" \
  --db=qs_rankings \
  --collection=egypt \
  --type=csv \
  --headerline \
  --file="full_path_to/software_training/qs_cleaned.csv"
```

**Prerequisites:**
- MongoDB server running on localhost:27017
- `mongoimport` tool installed (comes with MongoDB)
- `qs_cleaned.csv` file in the specified path

**Note:** Replace `full_path_to` with the actual path to your project directory.

## 🏗️ Current Project Structure

```
software_training/
├── Backend/
│   ├── src/
│   │   ├── app.js                 # Main Express application
│   │   ├── config/
│   │   │   └── db.js             # MongoDB connection configuration
│   │   ├── models/
│   │   │   └── university.model.js # Mongoose schema definition
│   │   ├── controllers/           # Route controllers (planned)
│   │   ├── routes/                # API routes (planned)
│   │   ├── middleware/            # Custom middleware (planned)
│   │   ├── services/              # Business logic (planned)
│   │   └── utils/                 # Utility functions (planned)
│   ├── package.json
│   ├── .eslintrc.json
│   ├── .prettierrc
│   └── .prettierignore
├── Frontend/
│   └── app.js                     # Basic frontend setup (to be developed)
├── docs/                          # Documentation (planned)
├── qs_cleaned.csv                 # University ranking data
├── LICENSE
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) and npm
- MongoDB (v6.0+)
- Git and GitHub account
- Code editor (VS Code recommended)

### Environment Setup

1. **Create Environment File**
   Create a `.env` file in the Backend directory:
   ```bash
   cd Backend
   touch .env
   ```

2. **Configure Environment Variables**
   Add the following to your `.env` file:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/qs_rankings
   NODE_ENV=development
   ```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd software_training
   ```

2. **Install Backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   ```

4. **Import data (optional)**
   If you haven't imported the data yet:
   ```bash
   mongoimport --uri="mongodb://localhost:27017" \
     --db=qs_rankings \
     --collection=egypt \
     --type=csv \
     --headerline \
     --file="../qs_cleaned.csv"
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Verify the setup**
   Open your browser and navigate to `http://localhost:3000/api` to see the universities data.

## 📡 API Endpoints

### Current Endpoints

#### GET `/api`
Returns all universities in the database.

**Response:**
```json
[
  {
    "_id": "ObjectId",
    "Index": 381,
    "2026 Rank": 381,
    "2025 Rank": 410,
    "Name": "The American University in Cairo",
    "Country": "Egypt",
    "Region": "Africa",
    "Size": "M",
    "Focus": "CO",
    "Research": "VH",
    "Status": "Private not for Profit",
    "AR SCORE": 40.8,
    "AR RANK": 292,
    "ER SCORE": 46.9,
    "ER RANK": 278,
    "FSR SCORE": 39,
    "FSR RANK": 521,
    "CPF SCORE": 12.2,
    "CPF RANK": "801+",
    "IFR SCORE": 98,
    "IFR RANK": 141,
    "ISR SCORE": 7.1,
    "ISR RANK": "801+",
    "ISD SCORE": 11.7,
    "ISD RANK": "801+",
    "IRN SCORE": 46.8,
    "IRN RANK": "801+",
    "EO SCORE": 88.6,
    "EO RANK": 118,
    "SUS SCORE": 51.6,
    "SUS RANK": "669=",
    "Overall SCORE": 39.4
  }
]
```

### Planned Endpoints

- `GET /api/universities` - Get all universities with pagination
- `GET /api/universities/:id` - Get specific university by ID
- `GET /api/universities/search` - Search universities by name
- `GET /api/universities/filter` - Filter universities by criteria
- `GET /api/rankings` - Get ranking statistics

## 🛠️ Development Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm test           # Run tests (planned)
```

## 📋 Development Guidelines

### Code Quality Standards
- **Code Reviews**: All code must be reviewed by at least one team member
- **Testing**: Minimum 80% code coverage (planned)
- **Documentation**: Comprehensive API documentation and inline comments
- **Performance**: Optimized for speed and scalability
- **Security**: Follow OWASP security guidelines

### Git Workflow
1. Create feature branch from `main`
2. Make changes and commit with descriptive messages
3. Push branch and create pull request
4. Code review and approval
5. Merge to `main`

## 🎯 Roadmap & Features

### Phase 1: Backend Foundation ✅
- [x] Express.js server setup
- [x] MongoDB connection and schema
- [x] Basic API endpoint
- [x] Data import functionality

### Phase 2: API Development 🚧
- [ ] Advanced filtering and search endpoints
- [ ] Pagination support
- [ ] Error handling middleware
- [ ] Input validation
- [ ] API documentation with Swagger

### Phase 3: Frontend Development 📋
- [ ] React.js application setup
- [ ] University listing page
- [ ] Search and filter functionality
- [ ] University detail pages
- [ ] Responsive design

### Phase 4: Advanced Features 📋
- [ ] User authentication
- [ ] Favorites/bookmarks
- [ ] Comparison tool
- [ ] Export functionality
- [ ] Admin dashboard

### Phase 5: Production Ready 📋
- [ ] Testing suite
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment automation
- [ ] Monitoring and logging

## 📊 Success Metrics

### Technical Metrics
- **Performance**: API response time < 500ms
- **Uptime**: 99.9% availability
- **Security**: Zero critical vulnerabilities
- **Code Quality**: Maintainable and well-documented code

### Business Metrics
- **User Engagement**: Active users and session duration
- **Data Accuracy**: Correct university rankings and information
- **User Satisfaction**: Feedback scores and retention rates
- **Market Readiness**: Feature completeness and scalability

## 🤝 Team Collaboration

### Communication
- **Daily Standups**: Quick status updates and blocker identification
- **Weekly Reviews**: Code reviews and architecture discussions
- **Sprint Planning**: Feature planning and task assignment
- **Retrospectives**: Process improvement and team feedback

### Tools & Platforms
- **Project Management**: Jira, Trello, or Asana
- **Design Collaboration**: Figma or Adobe XD
- **Code Repository**: GitHub with branch protection
- **Documentation**: Notion, Confluence, or Google Docs

## 📚 Learning Resources

### Backend Development
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

### Frontend Development
- [React Documentation](https://reactjs.org/docs/)
- [Modern JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Grid and Flexbox](https://css-tricks.com/)
- [Web Performance](https://web.dev/performance/)

### DevOps & Deployment
- [Docker Tutorial](https://docs.docker.com/get-started/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [AWS Documentation](https://aws.amazon.com/documentation/)

## 📞 Contact & Support

For questions, suggestions, or collaboration opportunities:
- **Backend Developers**: 
  - Abdelrahman Atef - abdoomer1112003@gmail.com
  - Youssef Essam - youssefessam5623@gmail.com
- **Frontend Developer**: 
  - Marawan Saqr - abdelrahman.abdelazem@gmail.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to build amazing projects and prepare for market success! 🚀**
