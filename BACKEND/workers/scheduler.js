const cron = require('node-cron');
const prisma = require('../prisma/prisma.dbPool');
const { pingMany } = require('../services/pingServices');
const { sendStatusNotification } = require('../services/notificationServices');
const { queueOfflineAlert, flushOfflineQueue } = require('../services/emailQueue'); // <-- baris baru

const OFFLINE_THRESHOLD = Number(process.env.OFFLINE_THRESHOLD || 3);

async function runPingSession() {
  const sessionStart = Date.now();
  const sesi = await prisma.sesi.create({ data: { start: new Date() } });

  try {
    const devices = await prisma.access_point.findMany({
      select: { id_ap: true, ip_address: true, nama: true, lokasi: true, status_terakhir: true, fail_counter: true },
    });

    if (devices.length === 0) {
      console.log('[scheduler] Belum ada AP terdaftar, sesi dilewati.');
      return;
    }

    const results = await pingMany(devices);

    await Promise.all(
      results.map((r) =>
        processDeviceResult(r, sesi.id_sesi).catch((err) => {
          console.error(`[scheduler] Gagal memproses AP id=${r.id_ap}:`, err.message);
        })
      )
    );
  } finally {
    const delay = Date.now() - sessionStart;
    await prisma.sesi.update({
      where: { id_sesi: sesi.id_sesi },
      data: { end: new Date(), delay },
    });
  }
}

async function processDeviceResult(result, idSesi) {
  const { id_ap, alive, responseTime, status_terakhir, fail_counter, nama, ip_address, lokasi } = result;

  try {
    if (!alive) {
      const newCounter = fail_counter + 1;
      await prisma.access_point.update({
        where: { id_ap },
        data: { fail_counter: newCounter },
      });
      console.log(`[ping] ${nama} (${ip_address}) RTO -- counter: ${newCounter}/${OFFLINE_THRESHOLD}`);

      if (newCounter >= OFFLINE_THRESHOLD && status_terakhir !== 'offline') {
        await prisma.$transaction([
          prisma.access_point.update({ where: { id_ap }, data: { status_terakhir: 'offline' } }),
          prisma.log.create({ data: { id_ap, id_sesi: idSesi, status: 'offline', response_time: null } }),
        ]);

        const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        queueOfflineAlert({ id_ap, nama, ip_address, lokasi, waktu });

        await prisma.notifikasi.create({
          data: { id_ap, pesan: `AP ${nama} (${ip_address}) OFFLINE` },
        });
      }
    } else {
      await prisma.access_point.update({ where: { id_ap }, data: { fail_counter: 0 } });
      console.log(`[ping] ${nama} (${ip_address}) OK -- ${responseTime}ms`);

      if (status_terakhir === 'offline') {
        await prisma.$transaction([
          prisma.access_point.update({ where: { id_ap }, data: { status_terakhir: 'online' } }),
          prisma.log.create({ data: { id_ap, id_sesi: idSesi, status: 'online', response_time: responseTime } }),
        ]);

        const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        const notif = await sendStatusNotification({ nama, ip_address, status: 'online', waktu });
        await prisma.notifikasi.create({
          data: { id_ap, pesan: `AP ${nama} (${ip_address}) ONLINE kembali${notif.success ? '' : ' [gagal kirim WA]'}` },
        });
      } else if (status_terakhir === 'unknown') {
        await prisma.access_point.update({ where: { id_ap }, data: { status_terakhir: 'online' } });
      }
    }
  } catch (err) {
    if (err.code === 'P2025') {
      // AP dihapus lewat Configuration di tengah sesi ping ini sedang berjalan -- bukan bug, lewati saja.
      console.log(`[scheduler] AP id=${id_ap} (${nama}) sudah dihapus sebelum sesi ini selesai, dilewati.`);
      return;
    }
    throw err; // error lain (bukan "record not found") tetap dilempar ke .catch() di runPingSession
  }
}

function startScheduler() {
  const cronExpr = process.env.PING_INTERVAL_CRON || '*/10 * * * * *';
  console.log(`[scheduler] Dijadwalkan dengan pola cron: ${cronExpr}`);
  cron.schedule(cronExpr, () => {
    runPingSession().catch((err) => console.error('[scheduler] Sesi ping gagal total:', err.message));
  });

  const emailFlushExpr = process.env.EMAIL_BATCH_INTERVAL_CRON || '*/35 * * * * *';
  console.log(`[scheduler] Email batch flush dijadwalkan tiap: ${emailFlushExpr}`);
  cron.schedule(emailFlushExpr, () => {
    flushOfflineQueue().catch((err) => console.error('[scheduler] Flush email batch gagal:', err.message));
  });
}

module.exports = { startScheduler };