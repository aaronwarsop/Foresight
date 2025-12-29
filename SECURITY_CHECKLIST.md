# Security Checklist - Files NOT to Commit

## ✅ Protected Files (Gitignored)

These files contain sensitive credentials and **MUST NEVER be committed**:

### Backend Configuration
- ✅ `backend/src/main/resources/application.properties`
  - Contains: Database password, Finnhub API keys
  - Template: `application.properties.example` (safe to commit)

### Frontend Service Files
- ✅ `frontend/src/services/supabase.js`
  - Contains: Supabase URL and anon key
  - Template: `supabase.js.example` (safe to commit)

- ✅ `frontend/src/services/api.js`
  - Contains: Backend API URL (hardcoded)
  - Template: `api.js.example` (safe to commit)

- ✅ `frontend/src/services/websocket.js`
  - Contains: WebSocket URL (hardcoded)
  - Template: `websocket.js.example` (safe to commit)

### Environment Files
- ✅ `frontend/.env`
  - Contains: All environment variables
  - Never committed

---

## 📋 Before Every Commit

Run this command to verify:

```bash
git status
```

**None of these should appear in the output:**
- `application.properties`
- `supabase.js` (without .example)
- `api.js` (without .example)
- `websocket.js` (without .example)
- `.env` (without .example)

---

## ✅ Safe to Commit

These are template files with placeholder values:
- ✅ `*.example` files
- ✅ `SETUP_INSTRUCTIONS.md`
- ✅ `SECURITY_CHECKLIST.md`
- ✅ `.gitignore` files
- ✅ `PROJECT_STATUS.md` (with placeholders)
- ✅ All Java/JavaScript source code (except the files above)

---

## 🔐 What Each File Contains

| File | Sensitive Data |
|------|---------------|
| `application.properties` | Database password, Finnhub API key + secret |
| `supabase.js` | Supabase project URL, Supabase anon key |
| `api.js` | Backend API URL (localhost for dev) |
| `websocket.js` | WebSocket URL (localhost for dev) |
| `.env` | All frontend environment variables |

---

## 🚨 If You Accidentally Committed Credentials

If you accidentally committed any of these files:

1. **DO NOT PUSH** to remote
2. Remove from git history:
   ```bash
   git rm --cached path/to/file
   git commit -m "Remove sensitive file from tracking"
   ```
3. Ensure file is in `.gitignore`
4. **Rotate all exposed credentials immediately**:
   - Reset database password in Supabase
   - Generate new Finnhub API key
   - Regenerate Supabase anon key if exposed

---

## ✅ Current Status

Both repositories are configured:
- ✅ Main repo `.gitignore` updated
- ✅ Frontend repo `.gitignore` updated
- ✅ Template files created
- ✅ All sensitive files protected

**Last verified:** 2025-12-29
