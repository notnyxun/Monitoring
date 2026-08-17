// workers/scheduler.js
const cron = require('node-cron');
const pool = require('../config/db');
const { pingMany } = require('../services/pingServices');
const { sendStatusNotification } = require('../services/notificationServices');
const { queueOfflineAlert, flushOfflineQueue } = require('../services/emailQueue');

const OFFLINE_THRESHOLD = Number(process.env.OFFLINE_THRESHOLD || 3);

async function runPingSession() {
  const sessionStart = Date.now();
  const [sesiResult] = await pool.query('INSERT INTO sesi (start) VALUES (NOW())');
  const idSesi = sesiResult.insertId;

  try {
    const [devices] = await pool.query(
      'SELECT id_ap, ip_address, nama, lokasi, status_terakhir, fail_counter FROM access_point'
    );

    if (devices.length === 0) {
      console.log('[scheduler] Belum ada AP terdaftar, sesi dilewati.');
      return;
    }

    const results = await pingMany(devices);

    await Promise.all(
      results.map((r) =>
        processDeviceResult(r, idSesi).catch((err) => {
          console.error(`[scheduler] Gagal memproses AP id=${r.id_ap}:`, err.message);
        })
      )
    );
  } finally {
    const delay = Date.now() - sessionStart;
    await pool.query('UPDATE sesi SET `end` = NOW(), delay = ? WHERE id_sesi = ?', [delay, idSesi]);
  }
}

async function processDeviceResult(result, idSesi) {
  const { id_ap, alive, responseTime, status_terakhir, fail_counter, nama, ip_address, lokasi } = result;

  if (!alive) {
    const [updateResult] = await pool.query(
      'UPDATE access_point SET fail_counter = ? WHERE id_ap = ?',
      [fail_counter + 1, id_ap]
    );
    // affectedRows = 0 berarti AP ini sudah dihapus di tengah sesi (race condition) -- lewati saja, bukan error.
    if (updateResult.affectedRows === 0) {
      console.log(`[scheduler] AP id=${id_ap} (${nama}) sudah dihapus, dilewati.`);
      return;
    }
    const newCounter = fail_counter + 1;
    console.log(`[ping] ${nama} (${ip_address}) RTO -- counter: ${newCounter}/${OFFLINE_THRESHOLD}`);

    if (newCounter >= OFFLINE_THRESHOLD && status_terakhir !== 'offline') {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await conn.query('UPDATE access_point SET status_terakhir = ? WHERE id_ap = ?', ['offline', id_ap]);
        await conn.query(
          'INSERT INTO log (id_ap, id_sesi, status, response_time) VALUES (?, ?, ?, NULL)',
          [id_ap, idSesi, 'offline']
        );
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }

      const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
      queueOfflineAlert({ id_ap, nama, ip_address, lokasi, waktu });

      await pool.query('INSERT INTO notifikasi (id_ap, pesan) VALUES (?, ?)', [
        id_ap,
        `AP ${nama} (${ip_address}) OFFLINE`,
      ]);
    }
  } else {
    const [updateResult] = await pool.query(
      'UPDATE access_point SET fail_counter = 0 WHERE id_ap = ?',
      [id_ap]
    );
    if (updateResult.affectedRows === 0) {
      console.log(`[scheduler] AP id=${id_ap} (${nama}) sudah dihapus, dilewati.`);
      return;
    }
    console.log(`[ping] ${nama} (${ip_address}) OK -- ${responseTime}ms`);

    if (status_terakhir === 'offline') {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await conn.query('UPDATE access_point SET status_terakhir = ? WHERE id_ap = ?', ['online', id_ap]);
        await conn.query(
          'INSERT INTO log (id_ap, id_sesi, status, response_time) VALUES (?, ?, ?, ?)',
          [id_ap, idSesi, 'online', responseTime]
        );
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }

      const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
      const notif = await sendStatusNotification({ nama, ip_address, status: 'online', waktu });
      await pool.query('INSERT INTO notifikasi (id_ap, pesan) VALUES (?, ?)', [
        id_ap,
        `AP ${nama} (${ip_address}) ONLINE kembali${notif.success ? '' : ' [gagal kirim WA]'}`,
      ]);
    } else if (status_terakhir === 'unknown') {
      await pool.query('UPDATE access_point SET status_terakhir = ? WHERE id_ap = ?', ['online', id_ap]);
    }
  }
}

function startScheduler() {
  const cronExpr = process.env.PING_INTERVAL_CRON || '*/10 * * * * *';
  console.log(`[scheduler] Dijadwalkan dengan pola cron: ${cronExpr}`);
  cron.schedule(cronExpr, () => {
    runPingSession().catch((err) => console.error('[scheduler] Sesi ping gagal total:', err.message));
  });

  const emailFlushExpr = process.env.EMAIL_BATCH_INTERVAL_CRON || '*/20 * * * * *';
  console.log(`[scheduler] Email batch flush dijadwalkan tiap: ${emailFlushExpr}`);
  cron.schedule(emailFlushExpr, () => {
    flushOfflineQueue().catch((err) => console.error('[scheduler] Flush email batch gagal:', err.message));
  });
}

module.exports = { startScheduler };