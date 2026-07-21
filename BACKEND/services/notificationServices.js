/* Sementara, belum benar-benar kirim API Wangsaff (ini belum disambungin ke frontend). */
async function sendStatusNotification(payload) {
  console.log(`[STUB NOTIFIKASI] AP "${payload.nama}" (${payload.ip_address}) -> ${payload.status.toUpperCase()} pada ${payload.waktu}`);
  return { success: true };
}

module.exports = { sendStatusNotification };