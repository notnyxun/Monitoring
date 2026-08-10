const express = require('express');
const prisma = require('../prisma/prisma.dbPool');
const { z } = require('zod');

const router = express.Router();

const lantaiSchema = z.object({
  nama_lantai: z.string().trim().min(1, 'Nama lantai wajib diisi').max(100),
  deskripsi: z.string().trim().max(255).optional(),
});

/* GET /api/lantai, ini daftar lantai plus ringkasan jumlah AP di dashaboard. */
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

/* POST /api/lantai, buat lantai baru dari input manual saat menambah AP. */
router.post('/lantai', async (req, res) => {
  const parsed = lantaiSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { message: parsed.error.issues[0].message } });
  }

  try {
    const existing = await prisma.lantai.findFirst({
      where: { nama_lantai: { equals: parsed.data.nama_lantai, mode: 'insensitive' } },
    });

    if (existing) {
      return res.json({ success: true, data: existing, created: false });
    }

    const created = await prisma.lantai.create({
      data: {
        nama_lantai: parsed.data.nama_lantai,
        ...(parsed.data.deskripsi ? { deskripsi: parsed.data.deskripsi } : {}),
      },
    });

    res.status(201).json({ success: true, data: created, created: true });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;