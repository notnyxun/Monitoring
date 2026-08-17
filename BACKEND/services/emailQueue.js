// services/emailQueue.js
// Menampung AP yang baru offline sementara, dikirim sebagai 1 email batch tiap interval,
// bukan 1 email per AP -- lihat diskusi soal rate limit Resend (2 req/detik, 100 email/hari di free plan).
const { sendBatchOfflineEmail } = require('./notificationServices');

let pendingOffline = [];

function queueOfflineAlert(device) {
  pendingOffline.push(device);
}

async function flushOfflineQueue() {
  if (pendingOffline.length === 0) return;

  const batch = pendingOffline;
  pendingOffline = []; // kosongkan dulu supaya AP baru yang masuk selama proses kirim tidak ikut ke-flush 2x

  const result = await sendBatchOfflineEmail(batch);
  if (!result.success) {
    console.error(`[emailQueue] Gagal kirim batch email (${batch.length} AP):`, result.error);
  } else {
    console.log(`[emailQueue] Batch email terkirim untuk ${batch.length} AP.`);
  }
}

module.exports = { queueOfflineAlert, flushOfflineQueue };