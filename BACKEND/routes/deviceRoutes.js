const express = require('express');
const prisma = require('../prisma/prisma.dbPool');

const router = express.Router();

/* GET /api/devices, daftar semua AP dan status terakhirnya. */
router.get('/devices', async (req, res) => {
  try {
    const { id_lantai } = req.query;
    const devices = await prisma.access_point.findMany({
      where: id_lantai ? { id_lantai: Number(id_lantai) } : undefined,
      select: {
        id_ap: true,
        nama: true,
        ip_address: true,
        lokasi: true,
        id_lantai: true,
        status_terakhir: true,
        updated_at: true,
        lantai: { select: { nama_lantai: true } },
      },
      orderBy: { nama: 'asc' },
    });
    res.json({ success: true, data: devices });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/* GET /api/summary, ringkasan total (belum ada di frontend, baru fungsi untuk testing http req, kemungkinan dihapus). */
router.get('/summary', async (req, res) => {
  try {
    const [total, online, offline, unknown] = await Promise.all([
      prisma.access_point.count(),
      prisma.access_point.count({ where: { status_terakhir: 'online' } }),
      prisma.access_point.count({ where: { status_terakhir: 'offline' } }),
      prisma.access_point.count({ where: { status_terakhir: 'unknown' } }),
    ]);
    res.json({ success: true, data: { total, online, offline, unknown } });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/* GET /api/logs, diambil 200 log terakhir, untuk halaman Logs. */
router.get('/logs', async (req, res) => {
  try {
    const logs = await prisma.log.findMany({
      take: 200,
      orderBy: { waktu_ping: 'desc' },
      include: { access_point: { select: { nama: true, ip_address: true } } },
    });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

const { z } = require('zod');

/* Regex IPv4 agar input IP sesuai standar. */
const IPV4_REGEX =
  /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

const deviceSchema = z.object({
  nama: z.string().trim().min(1, 'Nama perangkat wajib diisi').max(100),
  ip_address: z.string().trim().regex(IPV4_REGEX, 'Format IP address tidak valid'),
  lokasi: z.string().trim().max(150).optional(),
  id_lantai: z.number().int().positive().optional(),
});

/* POST /api/devices, Tambah AP baru. */
router.post('/devices', async (req, res) => {
  const parsed = deviceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { message: parsed.error.issues[0].message } });
  }

  try {
    const device = await prisma.access_point.create({
      data: { ...parsed.data, status_terakhir: 'unknown' },
    });
    res.status(201).json({ success: true, data: device });
  } catch (err) {
    if (err.code === 'P2002') {
      /* Pesan kalau IP Address duplikat. */
      return res.status(409).json({ success: false, error: { message: 'IP address sudah terdaftar' } });
    }
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/* PUT /api/devices/:id, Ubah data AP. */
router.put('/devices/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, error: { message: 'ID tidak valid' } });
  }

  const parsed = deviceSchema.partial().safeParse(req.body); // .partial() -> field boleh sebagian saja
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { message: parsed.error.issues[0].message } });
  }

  try {
    const device = await prisma.access_point.update({
      where: { id_ap: id },
      data: parsed.data,
    });
    res.json({ success: true, data: device });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, error: { message: 'AP tidak ditemukan' } });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, error: { message: 'IP address sudah dipakai AP lain' } });
    }
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/* DELETE /api/devices/:id, Hapus AP. */
router.delete('/devices/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, error: { message: 'ID tidak valid' } });
  }

  try {
    await prisma.access_point.delete({ where: { id_ap: id } });
    res.json({ success: true, data: { deleted_id: id } });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, error: { message: 'AP tidak ditemukan' } });
    }
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;