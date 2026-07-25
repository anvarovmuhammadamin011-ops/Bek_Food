# BEK FOOD — Deployment Guide

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                     │
│                                                         │
│  Customer App:  https://bek-food.vercel.app             │
│  Admin Panel:   https://bek-food.vercel.app/admin       │
│  Driver Panel:  https://bek-food.vercel.app/driver      │
└─────────────────────┬───────────────────────────────────┘
                      │ API Calls
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Railway)                      │
│                                                         │
│  API:  https://bekfood-api.railway.app/api              │
│  Socket.IO: wss://bekfood-api.railway.app               │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              DATABASE (Railway PostgreSQL)               │
│                                                         │
│  PostgreSQL 16 + Prisma ORM                             │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

### 1.2 Create New Project
- Click **New Project**
- Select **Deploy from GitHub repo**
- Select `Bek_Food` repository
- Set **Root Directory** to `server`

### 1.3 Add PostgreSQL Database
- In Railway dashboard, click **+ New**
- Select **Database** → **PostgreSQL**
- This creates a managed PostgreSQL instance

### 1.4 Add Environment Variables
In your Railway service, go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<auto-filled by Railway>
JWT_SECRET=bekfood-production-secret-key-2026-change-this
JWT_REFRESH_SECRET=bekfood-refresh-secret-key-2026-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://bek-food.vercel.app
SOCKET_CORS_ORIGIN=https://bek-food.vercel.app
REDIS_URL=
```

### 1.5 Configure Build Settings
In **Settings** tab:
- **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command:** `node src/index.js`
- **Port:** 5000

### 1.6 Deploy
Railway will auto-deploy on every push to `main`.

### 1.7 Seed Database
After first deploy, open Railway terminal and run:
```bash
node prisma/seed.js
```

---

## Step 2: Connect Frontend to Backend

### 2.1 Get Backend URL
After Railway deploy, copy your backend URL (e.g., `https://bekfood-api.railway.app`)

### 2.2 Update Frontend Environment
In Vercel project settings → Environment Variables:

```
VITE_API_URL=https://bekfood-api.railway.app
```

### 2.3 Update Backend CORS
In Railway environment variables:
```
CORS_ORIGIN=https://bek-food.vercel.app
SOCKET_CORS_ORIGIN=https://bek-food.vercel.app
```

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Import Repository
- Go to https://vercel.com
- Import `Bek_Food` repository
- Framework: **Vite**
- Root Directory: `/` (root)

### 3.2 Environment Variables
```
VITE_API_URL=https://bekfood-api.railway.app
```

### 3.3 Deploy
Vercel will auto-deploy. The `vercel.json` handles all routing.

---

## Step 4: Database Setup

### Run Migrations
```bash
# In Railway terminal
npx prisma migrate deploy
```

### Seed Data
```bash
node prisma/seed.js
```

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bekfood.uz | admin123 |
| Driver | driver@bekfood.uz | driver123 |
| Customer | customer@bekfood.uz | customer123 |

---

## Alternative: Deploy to Render.com

If Railway doesn't work, use Render:

### Backend Service
1. Go to https://render.com
2. New → **Web Service**
3. Connect GitHub repo
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `node src/index.js`

### PostgreSQL Database
1. New → **PostgreSQL**
2. Copy Internal Database URL to `DATABASE_URL`

---

## Alternative: Deploy to DigitalOcean VPS

For full control, use a $6/mo VPS:

```bash
# SSH into server
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone repo
git clone https://github.com/anvarovmuhammadamin011-ops/Bek_Food.git
cd Bek_Food/server

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:password@db:5432/bekfood
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=https://bek-food.vercel.app
SOCKET_CORS_ORIGIN=https://bek-food.vercel.app
EOF

# Run with Docker Compose
docker-compose up -d

# Seed database
docker-compose exec app node prisma/seed.js
```

---

## Troubleshooting

### 404 on /admin routes
→ Make sure `vercel.json` is deployed with rewrites

### CORS errors
→ Check `CORS_ORIGIN` matches your Vercel domain exactly

### Database connection failed
→ Check `DATABASE_URL` in Railway/Render environment variables

### Socket.IO not connecting
→ Check `SOCKET_CORS_ORIGIN` and ensure WebSocket is enabled

### Build failed
→ Check Node.js version (requires 18+)
→ Check `prisma generate` runs during build

---

## Quick Commands

```bash
# Local development
cd server && npm run dev

# Database
cd server && npx prisma migrate dev
cd server && npx prisma db push
cd server && node prisma/seed.js

# Build frontend
npm run build

# Deploy (auto on push to main)
git add . && git commit -m "update" && git push
```
