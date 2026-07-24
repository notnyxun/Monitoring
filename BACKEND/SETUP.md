# Backend Setup Guide

## ⚠️ Issue yang Terjadi

Backend tidak bisa dijalankan karena:
```
Error: Cannot find module '../generated/prisma/client'
```

Ini karena Prisma Client belum di-generate.

## ✅ Solusi

### Step 1: Generate Prisma Client

```bash
cd BACKEND
npx prisma generate
```

Output yang benar:
```
Prisma schema loaded from prisma\schema.prisma.
✔ Generated Prisma Client (7.8.0) to .\generated\prisma in 51ms
```

### Step 2: Setup Database

Pastikan file `.env` sudah ada di folder BACKEND dengan database URL:

**File**: `BACKEND/.env`
```env
DATABASE_URL="file:./dev.db"
# atau untuk MySQL:
# DATABASE_URL="mysql://user:password@localhost:3306/monitoring"
```

### Step 3: Jalankan Prisma Migrate

```bash
npx prisma migrate dev --name init
```

Ini akan:
- Create database schema
- Generate Prisma Client
- Seed database dengan data awal

### Step 4: Jalankan Backend Server

```bash
npm run dev
```

Output yang benar:
```
> monitoring_ip_backend@1.0.0 dev
> tsx watch server.js

Server running on port 3000
```

## 🗄️ Database Schema

Backend menggunakan Prisma ORM dengan models:

**File**: `BACKEND/prisma/schema.prisma`

Struktur database mencakup:
- **access_point** - Device/AP yang dimonitor
- **lantai** - Lantai/floor building
- **log_status** - Log status perubahan
- **notifikasi** - Notifikasi dari sistem

## 📝 Environment Variables

**File**: `.env` (atau copy dari `env.example`)

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

## 🔌 API Endpoints

Setelah backend running, endpoints yang tersedia:

### Health Check
```
GET /api/health
```

### Lantai (Floor)
```
GET    /api/lantai              # Get all floors
POST   /api/lantai              # Create floor
PUT    /api/lantai/:id          # Update floor
DELETE /api/lantai/:id          # Delete floor
```

### Devices (Access Points)
```
GET    /api/devices             # Get all devices
GET    /api/devices?id_lantai=1 # Get devices by floor
POST   /api/devices             # Create device
PUT    /api/devices/:id         # Update device
DELETE /api/devices/:id         # Delete device
```

### Logs
```
GET    /api/logs                # Get all logs
GET    /api/logs?id_ap=1        # Get logs by AP
```

### Notifikasi
```
GET    /api/notifikasi          # Get all notifications
```

## 🔍 Testing Backend

### Test health check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "message": "Backend Node.js berjalan normal!",
  "total_access_point": 0
}
```

### Test get devices
```bash
curl http://localhost:3000/api/devices
```

## 🐛 Troubleshooting

### Error: Cannot find module 'prisma/client'
```bash
# Solution: Generate prisma client
npx prisma generate
```

### Error: Database not found
```bash
# Solution: Run migrations
npx prisma migrate dev --name init
```

### Error: Port 3000 already in use
```bash
# Solution: Kill process on port 3000 atau ubah PORT di .env
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# atau ubah PORT di .env ke 3001
PORT=3001
```

### Error: Connection timeout
```bash
# Solution: Pastikan database URL di .env benar
# atau gunakan SQLite untuk development
DATABASE_URL="file:./dev.db"
```

## 📚 Dokumentasi Prisma

- [Prisma Docs](https://www.prisma.io/docs/)
- [Prisma Schema](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)

## 🚀 Quick Start Backend

```bash
# 1. Navigate ke backend
cd BACKEND

# 2. Install dependencies (jika belum)
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Setup database
npx prisma migrate dev --name init

# 5. Start dev server
npm run dev

# 6. Test health check
curl http://localhost:3000/api/health
```

## 📊 Frontend Integration

Setelah backend running dengan baik:

1. Update frontend hooks (`USE_MOCK_DATA = false`)
2. Frontend akan fetch data dari `http://localhost:3000/api`
3. Semua data akan real-time dari database

## 🔄 Data Flow

```
Frontend (React)
    ↓
useHooks (useLantai, useDevices, useLogs, useNotifikasi)
    ↓
API Endpoints (Backend)
    ↓
Prisma ORM
    ↓
Database (SQLite/MySQL)
```

