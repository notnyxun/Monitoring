// services/notificationService.js
// VERSI SEMENTARA -- belum benar-benar kirim WhatsApp.
// Diganti dengan panggilan WhatsApp Business API asli di Langkah 13.
async function sendStatusNotification(payload) {
  console.log(`[STUB NOTIFIKASI] AP "${payload.nama}" (${payload.ip_address}) -> ${payload.status.toUpperCase()} pada ${payload.waktu}`);
  return { success: true };
}

module.exports = { sendStatusNotification };