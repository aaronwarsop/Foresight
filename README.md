# Foresight

Full-stack application with React Native frontend, Java Spring Boot backend, and Python analytics.

## Project Structure

```
Foresight/
├── frontend/          # React Native (Expo) - iOS, Android, Web
├── backend/           # Java Spring Boot with Maven
├── analytics/         # Python analytics with Plotly, scikit-learn, TensorFlow
└── README.md
```

## Frontend (React Native with Expo)

Cross-platform mobile and web application built with React Native and Expo.

### Technologies
- React Native
- Expo (iOS, Android, Web support)
- JavaScript/TypeScript

### Setup
```bash
cd frontend
npm install
npm start
```

### Available Commands
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS (macOS only)
- `npm run web` - Run on web browser

## Backend (Java Spring Boot)

RESTful API backend built with Spring Boot and Maven.

### Technologies
- Java 17
- Spring Boot 3.2.1
- Spring Data JPA
- H2 Database (development)
- Maven

### Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### H2 Database Console
Access at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:foresightdb`
- Username: `sa`
- Password: (leave empty)

## Analytics (Python)

Data analytics, visualization, and machine learning module.

### Technologies
- Plotly - Interactive visualizations
- Scikit-learn - Machine learning
- TensorFlow - Deep learning
- Pandas - Data manipulation
- NumPy - Numerical computing
- Jupyter - Interactive notebooks

### Setup
```bash
cd analytics
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Unix/MacOS:
source venv/bin/activate

pip install -r requirements.txt
```

### Project Structure
- `src/` - Main source code
- `models/` - ML model storage
- `visualizations/` - Plotly visualization scripts
- `data/` - Data files (not in git)
- `notebooks/` - Jupyter notebooks

### Running Jupyter
```bash
jupyter notebook
```

## Integration Flow

1. **Frontend** → Makes API requests to **Backend**
2. **Backend** → Processes data and stores in database
3. **Analytics** → Generates visualizations and ML models
4. **Frontend** → Displays Plotly visualizations from **Analytics**

## Git

Repository initialized with comprehensive .gitignore to protect:
- Sensitive information (API keys, credentials, .env files)
- Dependencies (node_modules, venv, target/)
- Build artifacts
- IDE configuration files
- Large model files
- Data files

## Development Workflow

1. Start the backend: `cd backend && mvn spring-boot:run`
2. Start the frontend: `cd frontend && npm start`
3. Activate analytics environment: `cd analytics && venv\Scripts\activate`

## Next Steps

1. Configure environment variables for each service
2. Set up database (replace H2 with PostgreSQL/MySQL for production)
3. Implement authentication/authorization
4. Create API endpoints in backend
5. Build frontend components
6. Develop analytics models and visualizations
7. Integrate Plotly visualizations into frontend
