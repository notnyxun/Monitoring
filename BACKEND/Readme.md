## Setup Backend
Panduan singkat untuk menjalankan Backend secara lokal

1. Masuk folder Backend
```bash
cd BACKEND
```
2. Install dependencies (daftarnya ada pada `package.json`)
```bash
npm install
```
3. Konfigurasi `.env`
- Buat file `.env` di root folder BACKEND
- Salin isi dari `env.example` ke dalam file `.env` yang baru dibuat.
- Sesuaikan kredensial dan URL Database PostgreSQL (bisa dilakukan setelah Step 4.1).

4. Setup Database & Prisma
- Buka pgAdmin 4, lalu buat db_monitoring_ip (biarkan kosong, jangan diisi). Setelahnya, kembali ke Step 3.3
- Jalankan terminal untuk copy Database dari `schema.prisma` ke PostgreSQL
```bash
npx prisma db push
```
- Generate dependencies Prisma
```bash
npx prisma generate
```
5. Menjalankan server
```bash
npm run dev
```
