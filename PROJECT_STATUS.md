# Foresight - Stock Portfolio Dashboard

## Project Status: ✅ Core Implementation Complete

---

## What's Been Built

### Backend (Spring Boot + PostgreSQL)

#### Database Models ✅
- **User** - User account information with Supabase integration
- **Account** - Account summary with P&L tracking
- **Stock** - Stock information (symbol, price, dividends)
- **PortfolioHolding** - User's stock holdings with quantity and average buy price
- **Deposit** - Track user deposits for P&L calculation

#### REST API Endpoints ✅
**Portfolio:**
- `GET /api/portfolio/{userId}` - Get user's portfolio holdings
- `POST /api/portfolio` - Add stock to portfolio
- `DELETE /api/portfolio/{holdingId}` - Remove stock from portfolio
- `GET /api/portfolio/analysis/{userId}` - Get full portfolio analysis

**Account:**
- `GET /api/account/{userId}` - Get account summary
- `POST /api/account/deposit` - Record a deposit
- `GET /api/account/{userId}/deposits` - Get deposit history

**Stock:**
- `GET /api/stocks/{symbol}/quote` - Get real-time stock quote
- `GET /api/stocks/{symbol}` - Get stock information
- `GET /api/stocks/search/{query}` - Search stocks (placeholder)

#### Real-Time Features ✅
- **WebSocket integration** for live stock price updates
- **Scheduled price updates** every 10 seconds
- **Finnhub API integration** for market data

---

### Frontend (React Native + Expo)

#### Architecture ✅
- **React Navigation** with native stack navigator
- **Context API** for global state management
- **Custom hooks** for data fetching
- **Responsive design** (web + mobile layouts)

#### Services Layer ✅
- **API Service** - Axios-based REST client
- **WebSocket Service** - Real-time stock price subscriptions
- **Supabase Client** - Authentication integration

#### Context Providers ✅
- **UserContext** - Authentication state
- **PortfolioContext** - Portfolio data and operations
- **StockDataContext** - Real-time stock prices via WebSocket

#### Dashboard Components ✅

1. **AccountSummary**
   - Current portfolio value
   - Daily P&L
   - Total P&L (£ and %)
   - Total deposits

2. **DividendSummary**
   - Average portfolio yield %
   - Daily dividend estimate
   - Monthly dividend estimate
   - Annual dividend estimate

3. **UpcomingEvents**
   - Upcoming dividend payment dates
   - Upcoming earnings releases
   - Sorted chronologically

4. **PortfolioPieChart**
   - Visual portfolio composition
   - Victory Native pie chart
   - Color-coded by stock
   - Interactive legend

5. **PortfolioTable**
   - Scrollable table of all holdings
   - Shows: Symbol, Company, Quantity
   - Current value vs Invested amount
   - Average buy price vs Current price
   - P&L (£ and %) with color coding

---

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.1
- PostgreSQL (Supabase)
- Maven
- WebSocket (STOMP)
- Finnhub API

### Frontend
- React Native
- Expo SDK 52
- React Navigation 7
- Victory Native (charts)
- Axios
- SockJS + STOMP.js
- Supabase JS Client

### Analytics (Planned)
- Python 3.x
- Plotly
- scikit-learn
- TensorFlow

---

## Current Configuration

### Database Connection
- Host: `[Your Supabase instance]`
- Database: `postgres`
- Connection: ✅ Working

### API Endpoints
- Backend: `http://localhost:8080`
- WebSocket: `ws://localhost:8080/ws`

### Environment Variables
- Frontend: `frontend/.env` (✅ in .gitignore)
- Backend: `backend/src/main/resources/application.properties` (✅ in .gitignore)

---

## How to Run

### Backend
```bash
cd backend
mvn spring-boot:run
```
Server starts on: http://localhost:8080

### Frontend (Web)
```bash
cd frontend
npm start
# Press 'w' for web
```

### Frontend (Mobile)
```bash
cd frontend
npm start
# Scan QR code with Expo Go app
```

---

## What's Working

✅ Database schema auto-created by Hibernate
✅ REST API endpoints functional
✅ WebSocket real-time updates configured
✅ Finnhub API integration
✅ Frontend compiles successfully
✅ Responsive layout (web/mobile)
✅ All 5 dashboard components built
✅ Context providers for state management
✅ API service layer with Axios

---

## Next Steps (When Ready)

### Immediate
1. **Create test user** - Add a user to the database
2. **Add test stocks** - Populate portfolio with sample data
3. **Test end-to-end flow** - Verify frontend ↔ backend communication
4. **Add authentication UI** - Login/signup screens

### Features to Add
- Add stock search functionality
- Stock detail view screen
- Transaction history
- Performance charts (historical P&L)
- Portfolio rebalancing suggestions
- Risk analysis metrics

### Python Analytics
- Create Flask/FastAPI service
- Implement Plotly chart generation
- ML models for price prediction
- Portfolio optimization algorithms

---

## File Structure

```
Foresight/
├── backend/
│   ├── src/main/java/com/foresight/backend/
│   │   ├── ForesightApplication.java
│   │   ├── config/
│   │   │   └── WebSocketConfig.java
│   │   ├── controller/
│   │   │   ├── AccountController.java
│   │   │   ├── PortfolioController.java
│   │   │   └── StockController.java
│   │   ├── dto/
│   │   │   ├── AccountResponse.java
│   │   │   ├── AddStockRequest.java
│   │   │   ├── DepositRequest.java
│   │   │   ├── PortfolioResponse.java
│   │   │   └── StockPriceUpdate.java
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   ├── Account.java
│   │   │   ├── Stock.java
│   │   │   ├── PortfolioHolding.java
│   │   │   └── Deposit.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── AccountRepository.java
│   │   │   ├── StockRepository.java
│   │   │   ├── PortfolioHoldingRepository.java
│   │   │   └── DepositRepository.java
│   │   └── service/
│   │       ├── FinnhubService.java
│   │       ├── StockPriceService.java
│   │       ├── PortfolioService.java
│   │       └── AccountService.java
│   └── src/main/resources/
│       └── application.properties (gitignored)
│
├── frontend/
│   ├── App.js
│   ├── src/
│   │   ├── components/
│   │   │   └── dashboard/
│   │   │       ├── AccountSummary.js
│   │   │       ├── DividendSummary.js
│   │   │       ├── UpcomingEvents.js
│   │   │       ├── PortfolioPieChart.js
│   │   │       └── PortfolioTable.js
│   │   ├── context/
│   │   │   ├── UserContext.js
│   │   │   ├── PortfolioContext.js
│   │   │   └── StockDataContext.js
│   │   ├── hooks/
│   │   │   └── useAccountData.js
│   │   ├── screens/
│   │   │   └── DashboardScreen.js
│   │   └── services/
│   │       ├── api.js
│   │       ├── websocket.js
│   │       └── supabase.js
│   └── .env (gitignored)
│
└── analytics/
    └── (to be implemented)
```

---

## API Rate Limits

**Finnhub Free Tier:**
- 60 API calls per minute
- Current implementation: Updates portfolio stocks every 10 seconds
- Safe for portfolios up to ~60 stocks

---

## Security Notes

✅ All sensitive credentials in `.gitignore`
✅ Environment variables not committed
✅ Template files created (`.example`)
✅ Database password not in version control
✅ API keys stored securely

---

**Status:** Ready for testing and initial data population!
