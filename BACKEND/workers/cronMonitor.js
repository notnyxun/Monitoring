/*
 * Monitor durasi sesi cron ping ASLI, dibaca langsung dari tabel `sesi`
 * (diisi otomatis oleh workers/scheduler.js tiap siklus cron berjalan).
 * Read-only -- tidak menulis apapun ke database.
 *
 * Penggunaan:
 *   node scripts/monitorCronSessions.js              -> tampilkan 10 sesi terakhir
 *   node scripts/monitorCronSessions.js --last 30     -> 30 sesi terakhir
 *   node scripts/monitorCronSessions.js --watch       -> pantau live, sesi baru muncul otomatis
 */

require('dotenv').config();
const prisma = require('../prisma/prisma.dbPool');

function estimateCronSeconds(cronExpr) {
  const match = cronExpr.trim().match(/^\*\/(\d+)\s/);
  return match ? Number(match[1]) : null;
}

function stats(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sum / sorted.length,
  };
}

function formatSession(sesi, deviceCount, cronMs) {
  const pct = cronMs ? ((sesi.delay / cronMs) * 100).toFixed(1) : '?';
  const flag = cronMs && sesi.delay >= cronMs ? '  [OVERLAP RISK]' : '';
  const waktu = sesi.start.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  return `Sesi #${sesi.id_sesi} | ${waktu} | ${sesi.delay}ms (${pct}% dari interval)${flag}`;
}

async function printLastSessions(count) {
  const cronExpr = process.env.PING_INTERVAL_CRON || '*/10 * * * * *';
  const cronSeconds = estimateCronSeconds(cronExpr);
  const cronMs = cronSeconds ? cronSeconds * 1000 : null;
  const deviceCount = await prisma.access_point.count();

  const sessions = await prisma.sesi.findMany({
    where: { delay: { not: null } },
    orderBy: { id_sesi: 'desc' },
    take: count,
  });

  if (sessions.length === 0) {
    console.log('Belum ada sesi cron yang tercatat. Pastikan backend (scheduler) sedang berjalan.');
    return;
  }

  console.log(`=== ${sessions.length} Sesi Cron Terakhir (data asli dari database) ===`);
  console.log(`AP terdaftar saat ini : ${deviceCount}`);
  console.log(`Cron interval         : ${cronExpr} (~${cronSeconds ?? '?'}s)\n`);

  // urutkan kembali kronologis (lama -> baru) biar enak dibaca
  [...sessions].reverse().forEach((s) => console.log(formatSession(s, deviceCount, cronMs)));

  const delays = sessions.map((s) => s.delay);
  const d = stats(delays);
  console.log('\n=== Ringkasan ===');
  console.log(`Durasi sesi : min ${d.min}ms / avg ${d.avg.toFixed(1)}ms / max ${d.max}ms`);
  if (cronMs) {
    const avgPct = (d.avg / cronMs) * 100;
    console.log(`Pemakaian slot rata-rata : ${avgPct.toFixed(1)}% dari interval cron`);
    const overlapCount = sessions.filter((s) => s.delay >= cronMs).length;
    if (overlapCount > 0) {
      console.log(`PERINGATAN: ${overlapCount} dari ${sessions.length} sesi berisiko overlap (durasi >= interval cron)!`);
    } else {
      console.log('Aman: tidak ada sesi yang mendekati/melebihi interval cron.');
    }
  }
}

async function watchSessions() {
  const cronExpr = process.env.PING_INTERVAL_CRON || '*/10 * * * * *';
  const cronSeconds = estimateCronSeconds(cronExpr);
  const cronMs = cronSeconds ? cronSeconds * 1000 : null;

  console.log(`=== Live Monitor Sesi Cron (Ctrl+C untuk berhenti) ===`);
  console.log(`Cron interval: ${cronExpr} (~${cronSeconds ?? '?'}s)\n`);

  const latest = await prisma.sesi.findFirst({ orderBy: { id_sesi: 'desc' } });
  let lastSeenId = latest ? latest.id_sesi : 0;

  setInterval(async () => {
    const newSessions = await prisma.sesi.findMany({
      where: { id_sesi: { gt: lastSeenId }, delay: { not: null } },
      orderBy: { id_sesi: 'asc' },
    });

    for (const s of newSessions) {
      console.log(formatSession(s, null, cronMs));
      lastSeenId = s.id_sesi;
    }
  }, 2000);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--watch')) {
    await watchSessions();
    return; // biarkan proses tetap hidup (setInterval)
  }

  const lastIndex = args.indexOf('--last');
  const count = lastIndex !== -1 ? Number(args[lastIndex + 1]) : 10;

  await printLastSessions(count);
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Gagal membaca sesi cron:', err.message);
  process.exit(1);
});