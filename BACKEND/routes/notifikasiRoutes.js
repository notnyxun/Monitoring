const express = require('express');
const prisma = require('../prisma/prisma.dbPool');

const router = express.Router();

/* GET /api/notifikasi, ini notifikasi terbaru untuk bar lonceng di frontend. */
router.get('/notifikasi', async (req, res) => {
  try {
    const notifikasi = await prisma.notifikasi.findMany({
      take: 20,
      orderBy: { waktu: 'desc' },
      include: { access_point: { select: { nama: true, ip_address: true } } },
    });
    res.json({ success: true, data: notifikasi });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/* DELETE /api/notifikasi, hapus seluruh riwayat notifikasi. */
router.delete('/notifikasi', async (req, res) => {
  try {
    const result = await prisma.notifikasi.deleteMany({});
    res.json({ success: true, data: { deleted_count: result.count } });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;