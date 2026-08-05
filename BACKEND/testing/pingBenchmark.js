/*
 * Skrip benchmark untuk mengukur efisiensi siklus ping/cron sistem monitoring.
 * TIDAK menyentuh database production dan TIDAK mengirim email/notifikasi apapun --
 * murni mengukur lapisan ping (network I/O), bottleneck utama tiap siklus cron.
 *
 * Penggunaan:
 *   node testing/pingBenchmark.js --total 100 --offline 20
 *   node testing/pingBenchmark.js --total 50 --offline 10 --runs 5 --timeout 3
 *
 * Opsi:
 *   --total    Jumlah total AP yang disimulasikan (default: 20)
 *   --offline  Jumlah AP yang disimulasikan OFFLINE (default: 0)
 *   --timeout  Timeout ping per device dalam detik (default: dari .env PING_TIMEOUT_SECONDS, atau 3)
 *   --runs     Berapa kali sesi diulang untuk dirata-rata (default: 1)
 */

require('dotenv').config();
const { pingMany } = require('../services/pingServices');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { total: 20, offline: 0, timeout: null, runs: 1 };
  for (let i = 0; i < args.length; i++) {
    const [flag, inlineVal] = args[i].split('=');
    const key = flag.replace(/^--/, '');
    if (!['total', 'offline', 'timeout', 'runs'].includes(key)) continue;
    if (inlineVal !== undefined) {
      opts[key] = Number(inlineVal);
    } else {
      opts[key] = Number(args[i + 1]);
      i++;
    }
  }
  return opts;
}

function generateDevices(total, offlineCount) {
  if (offlineCount > total) {
    throw new Error(`--offline (${offlineCount}) tidak boleh lebih besar dari --total (${total})`);
  }

  const devices = [];

  // AP offline: blok TEST-NET-3, selalu RTO -- meniru AP mati di lapangan.
  for (let i = 0; i < offlineCount; i++) {
    devices.push({
      id_ap: `offline-${i + 1}`,
      nama: `[TEST] AP Offline ${i + 1}`,
      ip_address: `203.0.113.${(i % 254) + 1}`,
    });
  }

  // AP online: loopback, selalu langsung merespon.
  const onlineCount = total - offlineCount;
  for (let i = 0; i < onlineCount; i++) {
    devices.push({
      id_ap: `online-${i + 1}`,
      nama: `[TEST] AP Online ${i + 1}`,
      ip_address: '127.0.0.1',
    });
  }

  return devices;
}

function stats(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sum / sorted.length,
    median: sorted[Math.floor(sorted.length / 2)],
  };
}

async function runOnce(devices) {
  const start = Date.now();
  const results = await pingMany(devices);
  const duration = Date.now() - start;

  const online = results.filter((r) => r.alive).length;
  const offline = results.filter((r) => !r.alive).length;
  const responseTimes = results
    .filter((r) => r.alive && r.responseTime != null)
    .map((r) => r.responseTime);

  return { duration, online, offline, responseTimes };
}

/* Parsing kasar untuk pola cron detik "*/
function estimateCronSeconds(cronExpr) {
  const match = cronExpr.trim().match(/^\*\/(\d+)\s/);
  return match ? Number(match[1]) : null;
}

async function main() {
  const opts = parseArgs();
  const timeoutSeconds = opts.timeout || Number(process.env.PING_TIMEOUT_SECONDS || 3);
  const cronExpr = process.env.PING_INTERVAL_CRON || '*/10 * * * * *';

  process.env.PING_TIMEOUT_SECONDS = String(timeoutSeconds);

  console.log('=== Benchmark Siklus Ping ===');
  console.log(`Total AP        : ${opts.total}`);
  console.log(`AP Offline      : ${opts.offline}`);
  console.log(`AP Online       : ${opts.total - opts.offline}`);
  console.log(`Timeout/device  : ${timeoutSeconds}s`);
  console.log(`Jumlah run      : ${opts.runs}`);
  console.log(`Cron interval   : ${cronExpr} (dari .env PING_INTERVAL_CRON)`);
  console.log('------------------------------');

  const devices = generateDevices(opts.total, opts.offline);
  const durations = [];

  for (let run = 1; run <= opts.runs; run++) {
    const result = await runOnce(devices);
    durations.push(result.duration);

    console.log(`\nRun ${run}/${opts.runs}`);
    console.log(`  Durasi sesi    : ${result.duration} ms`);
    console.log(`  Online         : ${result.online}`);
    console.log(`  Offline        : ${result.offline}`);
    if (result.responseTimes.length > 0) {
      const rt = stats(result.responseTimes);
      console.log(`  Response time  : min ${rt.min}ms / avg ${rt.avg.toFixed(1)}ms / median ${rt.median}ms / max ${rt.max}ms`);
    }
  }

  console.log('\n=== Ringkasan ===');
  const d = stats(durations);
  console.log(`Durasi sesi     : min ${d.min}ms / avg ${d.avg.toFixed(1)}ms / max ${d.max}ms`);

  const cronSeconds = estimateCronSeconds(cronExpr);
  if (cronSeconds) {
    const cronMs = cronSeconds * 1000;
    const pct = (d.avg / cronMs) * 100;
    console.log(`Interval cron   : ~${cronSeconds}s (${cronMs}ms)`);
    console.log(`Pemakaian slot  : ${pct.toFixed(1)}% dari interval cron`);
    if (d.avg >= cronMs) {
      console.log('PERINGATAN: durasi rata-rata sesi >= interval cron -- sesi berikutnya berisiko tumpang tindih (overlap) dengan sesi yang belum selesai!');
    } else if (pct > 70) {
      console.log('PERHATIAN: pemakaian slot cron sudah di atas 70% -- pertimbangkan naikkan interval kalau jumlah AP terus bertambah.');
    } else {
      console.log('Aman: durasi sesi jauh di bawah interval cron.');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Benchmark gagal:', err.message);
    process.exit(1);
  });