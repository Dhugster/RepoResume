# RepoResume Setup Guide

## Quick Start (10 Minutes)

### Prerequisites
- Node.js 18+ installed
- GitHub account
- PostgreSQL 15+ (or use SQLite for development)
- Git

### Step 1: Clone and Install

```bash
# Clone the repository
cd AgeisTask

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# Minimum required:
# - GITHUB_CLIENT_ID
# - GITHUB_CLIENT_SECRET
# - SESSION_SECRET
# - JWT_SECRET
```

### Step 3: Set Up GitHub OAuth

1. Visit [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: RepoResume Local
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:3001/api/auth/github/callback`
4. Copy **Client ID** and **Client Secret** to `.env`

### Step 4: Database Setup

#### Option A: SQLite (Development - Easiest)
```bash
# Already configured by default in .env.example
# DATABASE_URL=sqlite:./database.sqlite
```

#### Option B: PostgreSQL (Production)
```bash
# Start PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
# Windows: Start PostgreSQL service

# Create database
createdb repo_resume

# Update .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/repo_resume
```

### Step 5: Start Development Servers

```bash
# From project root
npm run dev

# This starts:
# - Backend on http://localhost:3001
# - Frontend on http://localhost:5173
```

### Step 6: First Login

1. Open browser to `http://localhost:5173`
2. Click **"Login with GitHub"**
3. Authorize the application
4. You'll be redirected to the dashboard

## Docker Deployment

### Quick Docker Start

```bash
# Build and start all services
npm run docker:build
npm run docker:up

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# API Docs: http://localhost:3001/api-docs
```

### Docker Configuration

1. Update `.env` with production values
2. Ensure GitHub OAuth callback URL is updated
3. Run:

```bash
docker-compose up -d
```

Services:
- **PostgreSQL**: Automatic setup with persistent volume
- **Redis**: For background jobs and caching
- **Backend**: Express API server
- **Frontend**: React SPA served by Nginx

## Production Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Add Redis
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set GITHUB_CLIENT_ID=your_client_id
heroku config:set GITHUB_CLIENT_SECRET=your_secret
heroku config:set SESSION_SECRET=your_session_secret
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Open app
heroku open
```

### Option 2: DigitalOcean/AWS/Azure

1. **Create VM** (minimum 2GB RAM)
2. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Clone and Configure**:
   ```bash
   git clone <your-repo>
   cd AgeisTask
   cp .env.example .env
   nano .env  # Update with production values
   ```

4. **Deploy**:
   ```bash
   docker-compose up -d
   ```

5. **Set up Nginx Reverse Proxy** (optional but recommended)

### Option 3: Vercel (Frontend) + Heroku (Backend)

**Frontend (Vercel)**:
```bash
cd frontend
vercel deploy
```

**Backend (Heroku)**: Follow Heroku instructions above

## Troubleshooting

### Common Issues

**1. "GitHub OAuth not configured"**
- Ensure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are in `.env`
- Restart backend server after adding values

**2. "Database connection failed"**
- Check PostgreSQL is running: `pg_isadmin`
- Verify DATABASE_URL in `.env`
- For SQLite, ensure write permissions in project directory

**3. "Port already in use"**
```bash
# Find and kill process
# Backend (port 3001)
lsof -ti:3001 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

**4. "CORS errors"**
- Ensure FRONTEND_URL in backend `.env` matches your frontend URL
- Check that `withCredentials: true` is set in API client

**5. "Session not persisting"**
- Verify SESSION_SECRET is set and at least 32 characters
- Check browser is not blocking cookies
- In production, ensure `secure: true` for HTTPS

### Database Migration Issues

```bash
cd backend
npm run db:migrate
```

### Reset Database (Development)

```bash
# SQLite
rm database.sqlite

# PostgreSQL
dropdb repo_resume
createdb repo_resume

# Restart backend
cd backend
npm run dev
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Specific Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

## Development Tips

### Hot Reloading

- Backend: Nodemon automatically restarts on file changes
- Frontend: Vite HMR (Hot Module Replacement) is enabled

### API Documentation

Visit `http://localhost:3001/api-docs` for interactive Swagger documentation

### Database GUI Tools

**PostgreSQL**:
- pgAdmin: https://www.pgadmin.org/
- TablePlus: https://tableplus.com/
- DBeaver: https://dbeaver.io/

**SQLite**:
- DB Browser for SQLite: https://sqlitebrowser.org/
- TablePlus: https://tableplus.com/

### Debugging

**Backend**:
```bash
# Enable debug logs
LOG_LEVEL=debug npm run dev
```

**Frontend**:
- React DevTools: Browser extension
- React Query DevTools: Automatically enabled in development

## Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | `abc123def456` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | `secret123` |
| `SESSION_SECRET` | Express session secret (32+ chars) | `your-random-secret` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `your-jwt-secret` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `DATABASE_URL` | Database connection string | `sqlite:./database.sqlite` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `LOG_LEVEL` | Logging level | `info` |

## Security Checklist

Before deploying to production:

- [ ] Change all default secrets in `.env`
- [ ] Use strong, random values for SESSION_SECRET and JWT_SECRET
- [ ] Update GitHub OAuth callback URL to production domain
- [ ] Enable HTTPS (required for production)
- [ ] Set `NODE_ENV=production`
- [ ] Configure firewall rules
- [ ] Set up regular database backups
- [ ] Enable rate limiting (already configured)
- [ ] Review and restrict CORS origins
- [ ] Keep dependencies updated

## Performance Optimization

### Backend

1. **Enable Redis Caching**:
   ```bash
   # Install Redis
   brew install redis  # Mac
   sudo apt-get install redis  # Linux
   
   # Update .env
   REDIS_URL=redis://localhost:6379
   ```

2. **Database Indexing**: Already configured in models

3. **Connection Pooling**: Configured in `backend/src/config/database.js`

### Frontend

1. **Production Build**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Enable Compression**: Nginx config already includes gzip

3. **CDN**: Consider serving static assets from CDN

## Monitoring

### Application Logs

**Development**:
```bash
# Backend logs to console
cd backend && npm run dev
```

**Production**:
```bash
# Logs saved to backend/logs/
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

### Health Checks

- Backend: `http://localhost:3001/health`
- Database: Check connection in health endpoint response

## Backup Strategy

### Database Backup

**PostgreSQL**:
```bash
# Backup
pg_dump repo_resume > backup_$(date +%Y%m%d).sql

# Restore
psql repo_resume < backup_20240101.sql
```

**SQLite**:
```bash
# Backup
cp database.sqlite backup_$(date +%Y%m%d).sqlite

# Restore
cp backup_20240101.sqlite database.sqlite
```

### Automated Backups

Set up cron job (Linux/Mac):
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/project && pg_dump repo_resume > backups/backup_$(date +\%Y\%m\%d).sql
```

## Getting Help

- 📧 Email: support@reporesume.dev
- 🐛 Issues: GitHub Issues
- 📚 Documentation: README.md and USER_GUIDE.md

## Next Steps

After setup:

1. Read [USER_GUIDE.md](USER_GUIDE.md) for usage instructions
2. Sync your first repository
3. Analyze code and view generated tasks
4. Customize priority weights in Settings
5. Export tasks to your preferred format

---

**Setup Complete!** 🎉 Start analyzing your repositories.
