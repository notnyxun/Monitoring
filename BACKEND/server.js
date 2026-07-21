// server.js
const express = require('express');
const cors = require('cors'); // <-- baris baru

require('dotenv').config();

const prisma = require('./prisma/prisma.dbPool');
const { startScheduler } = require('./workers/scheduler');
const deviceRoutes = require('./routes/deviceRoutes'); // <-- baris baru
const lantaiRoutes = require('./routes/lantaiRoutes'); // <-- baris baru
const notifikasiRoutes = require('./routes/notifikasiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // <-- baris baru, izinkan request dari origin manapun (untuk development)
app.use(express.json());


app.get('/api/health', async (req, res) => {
  try {
    const totalAp = await prisma.access_point.count();
    res.json({ message: 'Backend Node.js berjalan normal!', total_access_point: totalAp });
  } catch (err) {
    res.status(500).json({ message: 'Gagal konek ke database via Prisma', error: err.message });
  }
});

app.use('/api', deviceRoutes); // <-- baris baru
app.use('/api', lantaiRoutes); // <-- baris baru
app.use('/api', notifikasiRoutes);

app.listen(PORT, () => {
  console.log(`Server Express menyala di http://localhost:${PORT}`);
  startScheduler();
});