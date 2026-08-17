// routes/deviceRoutes.js
const express = require('express');
const { z } = require('zod');
const pool = require('../config/db');

const router = express.Router();

router.get('/devices', async (req, res) => {
  try {
    const { id_lantai } = req.query;
    let sql = `
      SELECT ap.id_ap, ap.nama, ap.ip_address, ap.lokasi, ap.id_lantai,
             ap.status_terakhir, ap.updated_at, l.nama_lantai
      FROM access_point ap
      LEFT JOIN lantai l ON l.id_lantai = ap.id_lantai
    `;
    const params = [];
    if (id_lantai) {
      sql += ' WHERE ap.id_lantai = ?';
      params.push(Number(id_lantai));
    }
    sql += ' ORDER BY ap.nama ASC';

    const [rows] = await pool.query(sql, params);
    const data = rows.map((r) => ({
      id_ap: r.id_ap,
      nama: r.nama,
      ip_address: r.ip_address,
      lokasi: r.lokasi,
      id_lantai: r.id_lantai,
      status_terakhir: r.status_terakhir,
      updated_at: r.updated_at,
      lantai: r.nama_lantai ? { nama_lantai: r.nama_lantai } : null,
    }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const [[row]] = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(status_terakhir = 'online') AS online,
        SUM(status_terakhir = 'offline') AS offline,
        SUM(status_terakhir = 'unknown') AS unknown
      FROM access_point
    `);
    res.json({
      success: true,
      data: {
        total: Number(row.total),
        online: Number(row.online),
        offline: Number(row.offline),
        unknown: Number(row.unknown),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT lg.id_log, lg.status, lg.waktu_ping, lg.response_time, ap.nama, ap.ip_address
      FROM log lg
      JOIN access_point ap ON ap.id_ap = lg.id_ap
      ORDER BY lg.waktu_ping DESC
      LIMIT 200
    `);
    const data = rows.map((r) => ({
      id_log: r.id_log,
      status: r.status,
      waktu_ping: r.waktu_ping,
      response_time: r.response_time,
      access_point: { nama: r.nama, ip_address: r.ip_address },
    }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

const IPV4_REGEX =
  /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

const deviceSchema = z.object({
  nama: z.string().trim().min(1, 'Nama perangkat wajib diisi').max(100),
  ip_address: z.string().trim().regex(IPV4_REGEX, 'Format IP address tidak valid'),
  lokasi: z.string().trim().max(150).optional(),
  id_lantai: z.number().int().positive().optional(),
});

router.post('/devices', async (req, res) => {
  const parsed = deviceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { message: parsed.error.issues[0].message } });
  }
  const { nama, ip_address, lokasi, id_lantai } = parsed.data;

  try {
    const [result] = await pool.query(
      'INSERT INTO access_point (nama, ip_address, lokasi, id_lantai, status_terakhir) VALUES (?, ?, ?, ?, ?)',
      [nama, ip_address, lokasi || null, id_lantai || null, 'unknown']
    );
    const [[device]] = await pool.query('SELECT * FROM access_point WHERE id_ap = ?', [result.insertId]);
    res.status(201).json({ success: true, data: device });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: { message: 'IP address sudah terdaftar' } });
    }
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.put('/devices/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, error: { message: 'ID tidak valid' } });
  }

  const parsed = deviceSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { message: parsed.error.issues[0].message } });
  }

  const fields = parsed.data;
  const keys = Object.keys(fields);
  if (keys.length === 0) {
    return res.status(400).json({ success: false, error: { message: 'Tidak ada field yang diubah' } });
  }

  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => fields[k]);

  try {
    const [result] = await pool.query(`UPDATE access_point SET ${setClause} WHERE id_ap = ?`, [...values, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: { message: 'AP tidak ditemukan' } });
    }
    const [[device]] = await pool.query('SELECT * FROM access_point WHERE id_ap = ?', [id]);
    res.json({ success: true, data: device });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: { message: 'IP address sudah dipakai AP lain' } });
    }
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.delete('/devices/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, error: { message: 'ID tidak valid' } });
  }

  try {
    const [result] = await pool.query('DELETE FROM access_point WHERE id_ap = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: { message: 'AP tidak ditemukan' } });
    }
    res.json({ success: true, data: { deleted_id: id } });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;