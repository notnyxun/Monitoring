// routes/notifikasiRoutes.js
const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/notifikasi', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT n.id_notif, n.waktu, n.pesan, ap.nama, ap.ip_address
      FROM notifikasi n
      LEFT JOIN access_point ap ON ap.id_ap = n.id_ap
      ORDER BY n.waktu DESC
      LIMIT 20
    `);
    const data = rows.map((r) => ({
      id_notif: r.id_notif,
      waktu: r.waktu,
      pesan: r.pesan,
      access_point: r.nama ? { nama: r.nama, ip_address: r.ip_address } : null,
    }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;