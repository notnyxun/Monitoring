// routes/lantaiRoutes.js
const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/lantai', async (req, res) => {
  try {
    const [lantaiRows] = await pool.query('SELECT id_lantai, nama_lantai FROM lantai ORDER BY id_lantai ASC');
    const [apRows] = await pool.query('SELECT id_lantai, status_terakhir FROM access_point');

    const data = lantaiRows.map((l) => {
      const apsInFloor = apRows.filter((ap) => ap.id_lantai === l.id_lantai);
      return {
        id_lantai: l.id_lantai,
        nama_lantai: l.nama_lantai,
        total: apsInFloor.length,
        online: apsInFloor.filter((ap) => ap.status_terakhir === 'online').length,
        offline: apsInFloor.filter((ap) => ap.status_terakhir === 'offline').length,
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.post('/lantai', async (req, res) => {
  const nama_lantai = (req.body?.nama_lantai || '').trim();
  if (!nama_lantai) {
    return res.status(400).json({ success: false, error: { message: 'Nama lantai wajib diisi' } });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO lantai (nama_lantai) VALUES (?)',
      [nama_lantai]
    );
    const [[lantai]] = await pool.query('SELECT * FROM lantai WHERE id_lantai = ?', [result.insertId]);
    res.status(201).json({ success: true, data: lantai });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;

