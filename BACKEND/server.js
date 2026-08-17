const express = require('express');
const cors = require('cors'); 

require('dotenv').config();

const pool = require('./config/db');
const { startScheduler } = require('./workers/scheduler');
const deviceRoutes = require('./routes/deviceRoutes'); 
const lantaiRoutes = require('./routes/lantaiRoutes'); 
const notifikasiRoutes = require('./routes/notifikasiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const [[row]] = await pool.query('SELECT COUNT(*) AS total FROM access_point');
    res.json({ message: 'Backend Node.js berjalan normal!', total_access_point: Number(row.total) });
  } catch (err) {
    res.status(500).json({ message: 'Gagal konek ke database via MySQL', error: err.message });
  }
});



app.use('/api', deviceRoutes); 
app.use('/api', lantaiRoutes); 
app.use('/api', notifikasiRoutes);

app.listen(PORT, () => {
  console.log(`Server Express menyala di http://localhost:${PORT}`);
  startScheduler();
});