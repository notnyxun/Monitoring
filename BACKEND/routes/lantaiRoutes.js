// routes/lantaiRoutes.js
const express = require('express');
const prisma = require('../prisma/prisma.dbPool');

const router = express.Router();

// GET /api/lantai -> daftar lantai + ringkasan jumlah AP (untuk carousel Dashboard & dropdown form)
router.get('/lantai', async (req, res) => {
  try {
    const lantaiList = await prisma.lantai.findMany({
      select: {
        id_lantai: true,
        nama_lantai: true,
        access_point: { select: { status_terakhir: true } },
      },
      orderBy: { id_lantai: 'asc' },
    });

    const data = lantaiList.map((l) => ({
      id_lantai: l.id_lantai,
      nama_lantai: l.nama_lantai,
      total: l.access_point.length,
      online: l.access_point.filter((ap) => ap.status_terakhir === 'online').length,
      offline: l.access_point.filter((ap) => ap.status_terakhir === 'offline').length,
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;