# Foresight Setup Instructions

## ⚠️ Important: Credentials Setup

This project requires several configuration files with sensitive credentials. **These files are gitignored and must be created manually.**

---

## 1. Backend Configuration

### File: `backend/src/main/resources/application.properties`

Copy `application.properties.example` to `application.properties` and update with your credentials:

```properties
spring.application.name=foresight-backend
server.port=8080

# PostgreSQL Database Configuration (Supabase)
spring.datasource.url=jdbc:postgresql://db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=[YOUR_DATABASE_PASSWORD]
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Finnhub API Configuration
finnhub.api.key=[YOUR_FINNHUB_API_KEY]
finnhub.api.secret=[YOUR_FINNHUB_SECRET]
finnhub.api.base-url=https://finnhub.io/api/v1
```

**How to get credentials:**
- **Supabase**: Go to your project settings → Database → Connection String
- **Finnhub**: Sign up at https://finnhub.io and get your free API key

---

## 2. Frontend Service Configuration

### File: `frontend/src/services/supabase.js`

Copy `supabase.js.example` to `supabase.js` and update:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://[YOUR-PROJECT-REF].supabase.co';
const supabaseAnonKey = '[YOUR_SUPABASE_ANON_KEY]';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### File: `frontend/src/services/api.js`

Copy `api.js.example` to `api.js`:

```javascript
// Default configuration works for local development
const API_BASE_URL = 'http://localhost:8080';
```

### File: `frontend/src/services/websocket.js`

Copy `websocket.js.example` to `websocket.js`:

```javascript
// Default configuration works for local development
const WS_URL = 'http://localhost:8080/ws';
```

---

## 3. Frontend Environment Variables (Optional)

### File: `frontend/.env`

Already configured with your Supabase credentials. This file is gitignored.

---

## 4. Verify Gitignore

The following files are gitignored and **will not be committed**:

### Backend:
- `backend/src/main/resources/application.properties`
- `backend/src/main/resources/application-*.properties`

### Frontend:
- `frontend/.env`
- `frontend/src/services/supabase.js`
- `frontend/src/services/api.js`
- `frontend/src/services/websocket.js`

### Safe to commit:
- `*.example` files (templates)
- `SETUP_INSTRUCTIONS.md` (this file)

---

## 5. Running the Application

### Backend:
```bash
cd backend
mvn spring-boot:run
```

### Frontend:
```bash
cd frontend
npm start
# Press 'w' for web
```

---

## 6. Security Checklist

Before committing:
- [ ] `application.properties` is NOT in git
- [ ] `supabase.js` is NOT in git
- [ ] `api.js` is NOT in git
- [ ] `websocket.js` is NOT in git
- [ ] `.env` files are NOT in git
- [ ] Only `.example` files are committed

**Verify with:**
```bash
git status
```

None of the files above should appear in the output.

---

## Need Help?

- Check `.gitignore` to see all protected files
- All template files end with `.example`
- Never commit files with real credentials
